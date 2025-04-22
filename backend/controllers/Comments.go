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
	fmt.Println("Recebendo requisição para listar os comentários")

	postID := mux.Vars(r)["postId"]
	fmt.Printf("Post ID: %s\n", postID)

	var comments []models.Comment
	result := dataBase.DB.Preload("User").Where("post_id = ?", postID).Find(&comments)
	if result.Error != nil {
		http.Error(w, "Erro ao buscar comentários", http.StatusInternalServerError)
		fmt.Println("Erro ao buscar comentários:", result.Error)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	type CommentResponse struct {
		ID        uint   `json:"id"`
		Content   string `json:"content"`
		UserEmail string `json:"user_email"`
		UserName  string `json:"user_name"`
	}

	var response []CommentResponse
	for _, comment := range comments {
		userName := comment.User.Name
		if userName == "" || comment.UserEmail == "Anônimo" {
			userName = "Anônimo"
		}

		response = append(response, CommentResponse{
			ID:        comment.ID,
			Content:   comment.Content,
			UserEmail: comment.UserEmail,
			UserName:  userName,
		})
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Erro ao enviar comentários", http.StatusInternalServerError)
		fmt.Println("Erro ao enviar comentários:", err)
		return
	}

	fmt.Println("Comentários enviados com sucesso para o front-end")
}

func EditComment(w http.ResponseWriter, r *http.Request) {
	// Recebe os dados do corpo da requisição
	var commentRequest struct {
		CommentID uint   `json:"commentId"`
		Content   string `json:"content"`
		UserEmail string `json:"userEmail"`
	}
	err := json.NewDecoder(r.Body).Decode(&commentRequest)
	if err != nil {
		http.Error(w, "Erro ao ler os dados da requisição", http.StatusBadRequest)
		return
	}

	// Buscando o comentário pelo ID
	var comment models.Comment
	result := dataBase.DB.First(&comment, commentRequest.CommentID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "Comentário não encontrado", http.StatusNotFound)
			return
		}
		http.Error(w, "Erro ao buscar comentário", http.StatusInternalServerError)
		return
	}

	// Verificando se o comentário foi criado por um usuário anônimo
	if comment.UserEmail == "Anônimo" {
		http.Error(w, "Comentários anônimos não podem ser editados", http.StatusForbidden)
		return
	}

	// Verificando se o e-mail do usuário corresponde ao criador do comentário
	if comment.UserEmail != commentRequest.UserEmail {
		http.Error(w, "Usuário não autorizado a editar este comentário", http.StatusForbidden)
		return
	}

	// Atualizando o conteúdo do comentário
	comment.Content = commentRequest.Content

	// Salvando as alterações no banco de dados
	result = dataBase.DB.Save(&comment)
	if result.Error != nil {
		http.Error(w, "Erro ao salvar alterações no comentário", http.StatusInternalServerError)
		return
	}

	// Resposta de sucesso
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Comentário editado com sucesso!"))
}

func DeleteComment(w http.ResponseWriter, r *http.Request) {
	// Recebe os dados do corpo da requisição
	var deleteRequest struct {
		CommentID uint   `json:"commentId"`
		UserEmail string `json:"userEmail"`
	}
	err := json.NewDecoder(r.Body).Decode(&deleteRequest)
	if err != nil {
		http.Error(w, "Erro ao ler os dados da requisição", http.StatusBadRequest)
		return
	}

	// Buscando o comentário pelo ID
	var comment models.Comment
	result := dataBase.DB.First(&comment, deleteRequest.CommentID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "Comentário não encontrado", http.StatusNotFound)
			return
		}
		http.Error(w, "Erro ao buscar comentário", http.StatusInternalServerError)
		return
	}

	// Buscando o usuário pelo e-mail
	var user models.User
	result = dataBase.DB.Where("email = ?", deleteRequest.UserEmail).First(&user)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "Usuário não encontrado", http.StatusNotFound)
			return
		}
		http.Error(w, "Erro ao buscar usuário", http.StatusInternalServerError)
		return
	}

	// Verificando se o comentário é anônimo
	if comment.UserEmail == "Anônimo" {
		// Apenas administradores podem excluir comentários anônimos
		if user.UserType != "admin" {
			http.Error(w, "Apenas administradores podem excluir comentários anônimos", http.StatusForbidden)
			return
		}
	} else {
		// Verificando se o usuário é o autor do comentário ou um admin
		if comment.UserEmail != deleteRequest.UserEmail && user.UserType != "admin" {
			http.Error(w, "Usuário não autorizado a deletar este comentário", http.StatusForbidden)
			return
		}
	}

	// Excluindo o comentário
	result = dataBase.DB.Delete(&comment)
	if result.Error != nil {
		http.Error(w, "Erro ao deletar o comentário", http.StatusInternalServerError)
		return
	}

	// Resposta de sucesso
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Comentário deletado com sucesso!"))
}
