package controllers

import (
	"io"
	"net/http"

	"github.com/MateusReinert/TCC_IFSC/dataBase"
	"github.com/MateusReinert/TCC_IFSC/models"
	"gorm.io/gorm"
)

func CreatePost(w http.ResponseWriter, r *http.Request) {
	// Defina o limite para o tamanho do arquivo
	err := r.ParseMultipartForm(10 << 20) // 10 MB
	if err != nil {
		http.Error(w, "Erro ao processar o formulário", http.StatusBadRequest)
		return
	}

	// Pegando os dados do formulário
	title := r.FormValue("title")
	content := r.FormValue("content")
	email := r.FormValue("email") // O e-mail do usuário vem do front-end
	imageFile, _, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Erro ao obter a imagem", http.StatusBadRequest)
		return
	}
	defer imageFile.Close()

	// Lendo o conteúdo do arquivo de imagem e convertendo para []byte
	imageBytes, err := io.ReadAll(imageFile)
	if err != nil {
		http.Error(w, "Erro ao ler a imagem", http.StatusInternalServerError)
		return
	}

	// Buscando o user_id com base no e-mail
	var user models.User
	result := dataBase.DB.Where("email = ?", email).First(&user)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "Usuário não encontrado", http.StatusNotFound)
			return
		}
		http.Error(w, "Erro ao buscar usuário", http.StatusInternalServerError)
		return
	}

	// Agora podemos armazenar a postagem, incluindo o user_id
	post := models.Post{
		Title:     title,
		Content:   content,
		Image:     imageBytes,
		UserID:    user.ID, // Usando o user_id encontrado na busca
		UserEmail: email,   // O e-mail também é inserido, mas depende da sua lógica de banco
	}

	// Inserção no banco de dados
	result = dataBase.DB.Create(&post)
	if result.Error != nil {
		http.Error(w, "Erro ao salvar a postagem", http.StatusInternalServerError)
		return
	}

	// Enviar resposta de sucesso
	w.WriteHeader(http.StatusCreated) // para enviar o status 201
	w.Write([]byte("Postagem criada com sucesso!"))

}
