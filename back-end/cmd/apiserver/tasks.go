package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
	"strconv"
	"taskmanager/models"
	"time"
)

func CreateTask(w http.ResponseWriter, r *http.Request) {
	var task models.Task
	json.NewDecoder(r.Body).Decode(&task)

	// Extract user ID from JWT token context
	userID := r.Context().Value("user_id").(uint)
	task.UserID = userID // Associate task with the logged-in user

	result := DB.Create(&task)
	if result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(task)
}

func GetAllTasks(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(uint) // Получаем user_id из контекста

	var tasks []models.Task
	result := DB.Where("user_id = ?", userID).Find(&tasks)
	if result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(tasks)
}

func GetTasksByPeriod(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(uint)

	period := r.URL.Query().Get("period")

	var start, end time.Time
	now := time.Now()

	switch period {
	case "day":
		start = now.Truncate(24 * time.Hour)
		end = start.Add(24 * time.Hour)
	case "week":
		start = now.AddDate(0, 0, -int(now.Weekday()-1)).Truncate(24 * time.Hour)
		end = start.AddDate(0, 0, 7)
	case "month":
		start = time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, time.Local)
		end = start.AddDate(0, 1, 0)
	default:
		http.Error(w, "Invalid period. Use 'day', 'week', or 'month'.", http.StatusBadRequest)
		return
	}

	// Поиск задач по указанному периоду
	var tasks []models.Task
	result := DB.Where("user_id = ? AND created_at BETWEEN ? AND ?", userID, start, end).Find(&tasks)
	if result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(tasks)
}

func GetTask(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])

	var task models.Task
	result := DB.First(&task, id)
	if result.Error != nil {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	userID := r.Context().Value("user_id").(uint)

	// Check if the task belongs to the logged-in user
	if task.UserID != userID {
		http.Error(w, "Unauthorized access to task", http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(task)
}

func UpdateTask(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])

	var task models.Task
	result := DB.First(&task, id)
	if result.Error != nil {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	// Extract user ID from JWT token context
	userID := r.Context().Value("user_id").(uint)

	// Ensure the logged-in user owns the task
	if task.UserID != userID {
		http.Error(w, "Unauthorized access to update task", http.StatusUnauthorized)
		return
	}

	// Update the task
	json.NewDecoder(r.Body).Decode(&task)
	DB.Save(&task)

	json.NewEncoder(w).Encode(task)
}

// DeleteTask - Delete a task
func DeleteTask(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])

	var task models.Task
	result := DB.First(&task, id)
	if result.Error != nil {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	// Extract user ID from JWT token context
	userID := r.Context().Value("user_id").(uint)

	// Ensure the logged-in user owns the task
	if task.UserID != userID {
		http.Error(w, "Unauthorized access to delete task", http.StatusUnauthorized)
		return
	}

	// Delete the task
	DB.Delete(&task)

	fmt.Fprintf(w, "Task deleted successfully")
}
