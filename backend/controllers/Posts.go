package controllers

import (
	"encoding/json"
	"fmt"
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

	// Validando se o usuário pode criar uma postagem
	if user.UserType != "admin" && user.UserType != "user" && user.Status != "active" {
		// Se o usuário não for admin ou user, ou se o status não for ativo, negamos a criação da postagem
		http.Error(w, "Usuário não autorizado a criar postagens", http.StatusForbidden)
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

func GetPosts(w http.ResponseWriter, r *http.Request) {
    // Logando quando a função é chamada
    fmt.Println("Recebendo requisição para obter postagens")

    var posts []models.Post

    // Buscando todas as postagens no banco, ordenando primeiro pelos fixados e depois por data de criação
    result := dataBase.DB.Order("pinned DESC").Order("created_at DESC").Find(&posts)
    if result.Error != nil {
        http.Error(w, "Erro ao buscar postagens", http.StatusInternalServerError)
        fmt.Println("Erro ao buscar postagens:", result.Error)
        return
    }

    // Configura o cabeçalho da resposta para JSON
    w.Header().Set("Content-Type", "application/json")

    // Codifica as postagens em JSON e envia para o front-end
    if err := json.NewEncoder(w).Encode(posts); err != nil {
        http.Error(w, "Erro ao codificar postagens", http.StatusInternalServerError)
        return
    }

    // Logando sucesso ao enviar a resposta
    fmt.Println("Postagens enviadas com sucesso")
}

// EditPost: Função para editar uma postagem existente
func EditPost(w http.ResponseWriter, r *http.Request) {
	// Defina o limite para o tamanho do arquivo
	err := r.ParseMultipartForm(10 << 20) // 10 MB
	if err != nil {
		http.Error(w, "Erro ao processar o formulário", http.StatusBadRequest)
		return
	}

	// Pegando os dados do formulário
	postID := r.FormValue("post_id")
	title := r.FormValue("title")
	content := r.FormValue("content")
	email := r.FormValue("email") // O e-mail do usuário vem do front-end

	// Buscando o usuário com base no e-mail
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

	// Buscando a postagem com base no ID
	var post models.Post
	result = dataBase.DB.First(&post, postID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "Postagem não encontrada", http.StatusNotFound)
			return
		}
		http.Error(w, "Erro ao buscar postagem", http.StatusInternalServerError)
		return
	}

	// Validando se o usuário pode editar a postagem
	if post.UserID != user.ID && user.UserType != "admin" {
		http.Error(w, "Usuário não autorizado a editar esta postagem", http.StatusForbidden)
		return
	}

	// Atualizando os campos da postagem
	if title != "" {
		post.Title = title
	}
	if content != "" {
		post.Content = content
	}

	// Salvando as alterações no banco de dados
	result = dataBase.DB.Save(&post)
	if result.Error != nil {
		http.Error(w, "Erro ao salvar alterações na postagem", http.StatusInternalServerError)
		return
	}

	// Enviar resposta de sucesso
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Postagem editada com sucesso!"))
}

// DeletePost: Função para deletar uma postagem existente e seus comentários
func DeletePost(w http.ResponseWriter, r *http.Request) {
	// Pegando o ID da postagem a ser deletada do formulário
	postID := r.FormValue("post_id")
	email := r.FormValue("email") // O e-mail do usuário vem do front-end

	// Buscando o usuário com base no e-mail
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

	// Buscando a postagem com base no ID
	var post models.Post
	result = dataBase.DB.First(&post, postID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "Postagem não encontrada", http.StatusNotFound)
			return
		}
		http.Error(w, "Erro ao buscar postagem", http.StatusInternalServerError)
		return
	}

	// Validando se o usuário pode deletar a postagem
	if post.UserID != user.ID && user.UserType != "admin" {
		http.Error(w, "Usuário não autorizado a deletar esta postagem", http.StatusForbidden)
		return
	}

	// Excluindo os comentários associados à postagem
	result = dataBase.DB.Where("post_id = ?", postID).Delete(&models.Comment{})
	if result.Error != nil {
		http.Error(w, "Erro ao deletar comentários da postagem", http.StatusInternalServerError)
		return
	}

	// Excluindo a postagem
	result = dataBase.DB.Delete(&post)
	if result.Error != nil {
		http.Error(w, "Erro ao deletar a postagem", http.StatusInternalServerError)
		return
	}

	// Enviar resposta de sucesso
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Postagem e seus comentários foram deletados com sucesso!"))
}

func PinPost(w http.ResponseWriter, r *http.Request) {
    // Recebe os dados do corpo da requisição
    var request struct {
        PostID uint   `json:"postId"`
        Email  string `json:"email"`
    }
    err := json.NewDecoder(r.Body).Decode(&request)
    if err != nil {
        http.Error(w, "Erro ao ler os dados da requisição", http.StatusBadRequest)
        return
    }

    // Buscando o usuário pelo e-mail
    var user models.User
    result := dataBase.DB.Where("email = ?", request.Email).First(&user)
    if result.Error != nil {
        if result.Error == gorm.ErrRecordNotFound {
            http.Error(w, "Usuário não encontrado", http.StatusNotFound)
            return
        }
        http.Error(w, "Erro ao buscar usuário", http.StatusInternalServerError)
        return
    }

    // Verificando se o usuário é admin
    if user.UserType != "admin" {
        http.Error(w, "Apenas administradores podem fixar postagens", http.StatusForbidden)
        return
    }

    // Desfixar qualquer postagem já fixada
    result = dataBase.DB.Model(&models.Post{}).Where("pinned = ?", true).Update("pinned", false)
    if result.Error != nil {
        http.Error(w, "Erro ao desfixar postagens anteriores", http.StatusInternalServerError)
        return
    }

    // Buscar a postagem a ser fixada
    var post models.Post
    result = dataBase.DB.First(&post, request.PostID)
    if result.Error != nil {
        if result.Error == gorm.ErrRecordNotFound {
            http.Error(w, "Postagem não encontrada", http.StatusNotFound)
            return
        }
        http.Error(w, "Erro ao buscar postagem", http.StatusInternalServerError)
        return
    }

    // Fixar a postagem
    post.Pinned = true
    result = dataBase.DB.Save(&post)
    if result.Error != nil {
        http.Error(w, "Erro ao fixar a postagem", http.StatusInternalServerError)
        return
    }

    // Resposta de sucesso
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("Postagem fixada com sucesso!"))
}