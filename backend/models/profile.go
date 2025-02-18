package models

type Profile struct {
	Email string `json:"email" gorm:"unique"`
	Bio   string `json:"bio"`
}
