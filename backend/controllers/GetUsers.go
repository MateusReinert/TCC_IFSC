package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/MateusReinert/TCC_IFSC/dataBase"
	"github.com/MateusReinert/TCC_IFSC/models"
)

func GetUsers(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Recebendo requisição para obter usuários")

	var users []models.User

	result := dataBase.DB.Find(&users)
	if result.Error != nil {
		fmt.Println("Erro ao buscar usuários:", result.Error)
		http.Error(w, "Erro ao buscar usuários", http.StatusInternalServerError)
		return
	}

	fmt.Printf("Encontrados %d usuários\n", len(users))

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(users); err != nil {
		fmt.Println("Erro ao codificar os usuários para JSON:", err)
		http.Error(w, "Erro ao enviar usuários", http.StatusInternalServerError)
		return
	}

	fmt.Println("Usuários enviados com sucesso para o front-end")
}
