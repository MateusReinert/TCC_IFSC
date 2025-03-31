package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/MateusReinert/TCC_IFSC/dataBase"
	"github.com/MateusReinert/TCC_IFSC/models"
)

func CreateComment(w http.ResponseWriter, r *http.Request) {
    // Verifique se o método é POST
    if r.Method != http.MethodPost {
        http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
        return
    }

    // Decodifique o JSON do corpo da requisição
    var input struct {
        Content   string `json:"content"`
        PostID    uint   `json:"post_id"`
        UserEmail string `json:"email"`
    }

    err := json.NewDecoder(r.Body).Decode(&input)
    if err != nil {
        http.Error(w, "Erro ao processar o JSON", http.StatusBadRequest)
        return
    }

    // Validando os dados
    if input.Content == "" || input.PostID == 0 || input.UserEmail == "" {
        http.Error(w, "Todos os campos são obrigatórios", http.StatusBadRequest)
        return
    }

    // Criando o comentário
    comment := models.Comment{
        Content:   input.Content,
        PostID:    input.PostID,
        UserEmail: input.UserEmail,
    }

    // Salvando no banco de dados
    result := dataBase.DB.Create(&comment)
    if result.Error != nil {
        http.Error(w, "Erro ao salvar o comentário", http.StatusInternalServerError)
        return
    }

    // Resposta de sucesso
    w.WriteHeader(http.StatusCreated)
    w.Write([]byte("Comentário criado com sucesso!"))
}

func ListComments(w http.ResponseWriter, r *http.Request) {
	// Pegando o ID da postagem da query string
	postIDStr := r.URL.Query().Get("post_id")
	if postIDStr == "" {
		http.Error(w, "O ID da postagem é obrigatório", http.StatusBadRequest)
		return
	}

	// Convertendo o ID para uint
	postID, err := strconv.Atoi(postIDStr)
	if err != nil {
		http.Error(w, "ID da postagem inválido", http.StatusBadRequest)
		return
	}

	// Buscando os comentários no banco de dados
	var comments []models.Comment
	result := dataBase.DB.Where("post_id = ?", postID).Find(&comments)
	if result.Error != nil {
		http.Error(w, "Erro ao buscar comentários", http.StatusInternalServerError)
		return
	}

	// Retornando os comentários como JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comments)
}
