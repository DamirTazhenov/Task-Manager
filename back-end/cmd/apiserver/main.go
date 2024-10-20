package main

import (
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"gorm.io/gorm"
	"log"
	"net/http"
	"taskmanager/cmd/apiserver/jwt"
	"taskmanager/internal/config"
	"taskmanager/pkg/database"
)

var (
	DB         *gorm.DB
	configData *config.Config
)

func main() {
	database.InitDatabase()

	DB = database.GetDB()

	configData = config.NewConfig()

	router := mux.NewRouter()

	// Auth routes
	router.HandleFunc("/register", jwt.Register(DB)).Methods("POST")
	router.HandleFunc("/login", jwt.Login(DB)).Methods("POST")

	// Protected routes with prefix /api and jwt token
	api := router.PathPrefix("/api").Subrouter()
	api.Use(jwt.AuthMiddleware)

	api.HandleFunc("/tasks", GetAllTasks).Methods("GET")
	api.HandleFunc("/tasks/period", GetTasksByPeriod).Methods("GET")
	api.HandleFunc("/tasks", CreateTask).Methods("POST")
	api.HandleFunc("/tasks/{id}", GetTask).Methods("GET")
	api.HandleFunc("/tasks/{id}", UpdateTask).Methods("PUT")
	api.HandleFunc("/tasks/{id}", DeleteTask).Methods("DELETE")

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:3001"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)

	log.Fatal(http.ListenAndServe(configData.BindAddr, handler))
}
