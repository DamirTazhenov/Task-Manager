package models

import (
	"gorm.io/gorm"
)

// Task struct with GORM model
type Task struct {
	gorm.Model
	Title       string `json:"title"`
	Description string `json:"description"`
	Completed   bool   `json:"completed"`
	UserID      uint   `json:"user_id"` // Foreign key to User
}
