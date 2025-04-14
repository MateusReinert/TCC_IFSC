package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/MateusReinert/TCC_IFSC/dataBase"
	"github.com/MateusReinert/TCC_IFSC/models"
	"gorm.io/gorm"
)

func CreateComment(w http.ResponseWriter, r *http.Request) {
	// Recebe os dados do corpo da requisição
	var commentRequest struct {
		Content   string `json:"content"`
		PostID    uint   `json:"postId"`
		UserEmail string `json:"userEmail"`
	}
	err := json.NewDecoder(r.Body).Decode(&commentRequest)
	if err != nil {
		http.Error(w, "Erro ao ler os dados da requisição", http.StatusBadRequest)
		return
	}

	// Verifica se o e-mail foi passado, se não, define como "Anônimo"
	if commentRequest.UserEmail == "" {
		commentRequest.UserEmail = "Anônimo"
	}

	// Log para verificar o e-mail recebido
	fmt.Println("E-mail recebido:", commentRequest.UserEmail)

	// Buscando o usuário pelo e-mail, se o e-mail não for "Anônimo"
	var user models.User
	if commentRequest.UserEmail != "Anônimo" {
		result := dataBase.DB.Where("email = ?", commentRequest.UserEmail).First(&user)
		if result.Error != nil {
			if result.Error == gorm.ErrRecordNotFound {
				http.Error(w, "Usuário não encontrado", http.StatusNotFound)
				fmt.Println("Usuário não encontrado para o e-mail:", commentRequest.UserEmail)
				return
			}
			http.Error(w, "Erro ao buscar usuário", http.StatusInternalServerError)
			fmt.Println("Erro ao buscar usuário:", result.Error)
			return
		}

		// Log para confirmar que o usuário foi encontrado
		fmt.Println("Usuário encontrado:", user.Email)
	}

	// Criação do comentário
	comment := models.Comment{
		Content:   commentRequest.Content,
		PostID:    commentRequest.PostID,
		UserID:    user.ID,                  // Associando o UserID ao comentário
		UserEmail: commentRequest.UserEmail, // Preenchendo o campo user_email com o e-mail do usuário
	}

	// Inserindo no banco
	result := dataBase.DB.Create(&comment)
	if result.Error != nil {
		http.Error(w, "Erro ao salvar comentário", http.StatusInternalServerError)
		fmt.Println("Erro ao salvar comentário:", result.Error)
		return
	}

	// Log de sucesso
	fmt.Println("Comentário criado com sucesso para o post ID:", comment.PostID)

	// Resposta de sucesso
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("Comentário criado com sucesso!"))
}
