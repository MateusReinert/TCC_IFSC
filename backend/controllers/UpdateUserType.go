package controllers

import (
	"encoding/json"
	"fmt" // Importando para usar fmt.Println
	"net/http"

	"github.com/MateusReinert/TCC_IFSC/dataBase"
	"github.com/MateusReinert/TCC_IFSC/models"
)

// UpdateUserType: Função para atualizar o tipo de usuário
func UpdateUserType(w http.ResponseWriter, r *http.Request) {
	var requestData struct {
		UserID   int    `json:"user_id"`
		UserType string `json:"user_type"`
	}

	// Decodificando os dados do corpo da requisição
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Erro ao ler os dados da requisição", http.StatusBadRequest)
		fmt.Println("Erro ao decodificar dados:", err) // Adicionando log para erro na decodificação
		return
	}

	// Validando o tipo de usuário
	if requestData.UserType != "regular" && requestData.UserType != "admin" && requestData.UserType != "pending" {
		http.Error(w, "Tipo de usuário inválido", http.StatusBadRequest)
		fmt.Println("Tipo de usuário inválido:", requestData.UserType) // Log do tipo de usuário
		return
	}

	// Buscando o usuário no banco
	var user models.User
	if err := dataBase.DB.First(&user, requestData.UserID).Error; err != nil {
		http.Error(w, "Usuário não encontrado", http.StatusNotFound)
		fmt.Println("Usuário não encontrado, ID:", requestData.UserID) // Log caso o usuário não seja encontrado
		return
	}

	// Verificando se o tipo de usuário está sendo alterado de 'pending' para outro tipo
	if user.UserType == "pending" && requestData.UserType != "regular" {
		http.Error(w, "Usuário pendente só pode ser aprovado para 'regular'", http.StatusBadRequest)
		fmt.Println("Tentativa de mudar de 'pending' para tipo:", requestData.UserType) // Log para quando o tipo não for 'regular'
		return
	}

	// Verificando se o tipo de usuário está sendo alterado de 'regular' para 'admin'
	if user.UserType == "regular" && requestData.UserType != "admin" && requestData.UserType != "regular" {
		http.Error(w, "Tipo de usuário 'regular' só pode ser alterado para 'admin' ou 'regular'", http.StatusBadRequest)
		fmt.Println("Tentativa de mudança inválida de 'regular' para tipo:", requestData.UserType) // Log do tipo
		return
	}

	// Verificando se o tipo de usuário está sendo alterado de 'admin' para outro tipo
	if user.UserType == "admin" && requestData.UserType != "regular" {
		http.Error(w, "Tipo de usuário 'admin' só pode ser alterado para 'regular'", http.StatusBadRequest)
		fmt.Println("Tentativa de mudar de 'admin' para tipo:", requestData.UserType) // Log da tentativa
		return
	}

	// Atualizando o tipo de usuário
	user.UserType = requestData.UserType
	if err := dataBase.DB.Save(&user).Error; err != nil {
		http.Error(w, "Erro ao atualizar o tipo de usuário", http.StatusInternalServerError)
		fmt.Println("Erro ao salvar a alteração no banco:", err) // Log do erro ao salvar
		return
	}

	// Retornando a resposta de sucesso
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Tipo de usuário atualizado com sucesso"))
	fmt.Println("Tipo de usuário atualizado com sucesso para o ID:", requestData.UserID) // Log de sucesso
}
