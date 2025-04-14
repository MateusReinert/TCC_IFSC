package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/MateusReinert/TCC_IFSC/dataBase"
	"github.com/MateusReinert/TCC_IFSC/models"
	"github.com/gorilla/mux"
)

// ListComments é responsável por listar os comentários de uma postagem específica.
func ListComments(w http.ResponseWriter, r *http.Request) {
	// Logando quando a função é chamada
	fmt.Println("Recebendo requisição para listar os comentários")

	// Pegando o postId da URL
	postID := mux.Vars(r)["postId"]
	fmt.Printf("Post ID: %s\n", postID)

	// Buscando todos os comentários relacionados à postagem com o postID, incluindo o relacionamento com o usuário
	var comments []models.Comment
	result := dataBase.DB.Preload("User").Where("post_id = ?", postID).Find(&comments)
	if result.Error != nil {
		http.Error(w, "Erro ao buscar comentários", http.StatusInternalServerError)
		fmt.Println("Erro ao buscar comentários:", result.Error)
		return
	}

	// Logando o número de comentários encontrados
	fmt.Printf("Encontrados %d comentários para a postagem %s\n", len(comments), postID)

	// Configura o cabeçalho da resposta para JSON
	w.Header().Set("Content-Type", "application/json")

	// Criando uma lista de comentários com o nome e e-mail do usuário
	type CommentResponse struct {
		ID        uint   `json:"id"`
		Content   string `json:"content"`
		UserEmail string `json:"user_email"` // Adicionando o e-mail do usuário
		UserName  string `json:"user_name"`  // Adicionando o nome do usuário
	}

	var response []CommentResponse
	for _, comment := range comments {
		// Adiciona o nome e o e-mail do usuário ao comentário
		response = append(response, CommentResponse{
			ID:        comment.ID,
			Content:   comment.Content,
			UserEmail: comment.User.Email, // Garantir que o e-mail seja enviado
			UserName:  comment.User.Name,  // Garantir que o nome seja enviado
		})
	}

	// Codifica os comentários em JSON e envia para o front-end
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Erro ao enviar comentários", http.StatusInternalServerError)
		fmt.Println("Erro ao enviar comentários:", err)
		return
	}

	// Logando sucesso ao enviar a resposta
	fmt.Println("Comentários enviados com sucesso para o front-end")
}
