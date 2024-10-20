package jwt

import (
	"encoding/json"
	"fmt"
	"gorm.io/gorm"
	"net/http"
	"taskmanager/models"
)

// Register new users
func Register(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var user models.User
		json.NewDecoder(r.Body).Decode(&user)

		fmt.Println(user, user.Password)
		if err := user.HashPassword(user.Password); err != nil {
			http.Error(w, "Password encryption failed", http.StatusInternalServerError)
			return
		}

		result := db.Create(&user)
		if result.Error != nil {
			http.Error(w, result.Error.Error(), http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(user)
	}
}

// Login user and return JWT token
func Login(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var user models.User
		var loginData struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}

		if err := json.NewDecoder(r.Body).Decode(&loginData); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		result := db.Where("email = ?", loginData.Email).First(&user)
		if result.Error != nil {
			http.Error(w, "Invalid email", http.StatusUnauthorized)
			return
		}

		if err := user.CheckPassword(loginData.Password); err != nil {
			http.Error(w, "Invalid password", http.StatusUnauthorized)
			return
		}

		token, err := GenerateJWT(user.ID)
		if err != nil {
			http.Error(w, "Failed to generate token", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(map[string]string{"token": token})
	}
}
