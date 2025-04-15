package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/MateusReinert/TCC_IFSC/dataBase"
	"github.com/MateusReinert/TCC_IFSC/models"
	"github.com/gorilla/mux"
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