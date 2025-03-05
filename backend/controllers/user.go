package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/MateusReinert/TCC_IFSC/dataBase"
	"github.com/MateusReinert/TCC_IFSC/models"

	"gorm.io/gorm"
)

func Register(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var user models.User

		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			http.Error(w, "Erro ao decodificar JSON", http.StatusBadRequest)
			return
		}

		var existingUser models.User
		result := dataBase.DB.Where("email = ?", user.Email).First(&existingUser)

		if result.Error != nil && result.Error != gorm.ErrRecordNotFound {
			http.Error(w, "Erro ao consultar usuário", http.StatusInternalServerError)
			return
		}

		if result.Error == nil {
			http.Error(w, "Usuário já existe", http.StatusConflict)
			return
		}

		result = dataBase.DB.Create(&user)
		if result.Error != nil {
			http.Error(w, "Erro ao cadastrar usuário", http.StatusInternalServerError)
			return
		}

		fmt.Println("Usuário cadastrado com sucesso")
		w.WriteHeader(http.StatusCreated)
		w.Write([]byte("Usuário cadastrado com sucesso"))
	} else {
		http.Error(w, "Método não permitido", http.StatusCreated)
	}
}

func Login(w http.ResponseWriter, r *http.Request) {
	fmt.Println("entrou aqui")

	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Erro ao decodificar JSON", http.StatusBadRequest)
		return
	}

	var existingUser models.User
	result := dataBase.DB.Where("email = ?", user.Email).First(&existingUser)

	if result.Error == gorm.ErrRecordNotFound {
		http.Error(w, "Usuário ou senha inválidos", http.StatusUnauthorized)
		return
	}

	if result.Error != nil {
		http.Error(w, "Erro ao buscar usuário", http.StatusInternalServerError)
		return
	}

	if existingUser.Password != user.Password {
		http.Error(w, "Usuário ou senha inválidos", http.StatusUnauthorized)
		return
	}

	fmt.Println("Login realizado com sucesso!")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Login realizado com sucesso!"))
}

func RefreshBio(w http.ResponseWriter, r *http.Request) {
	var updateRequest models.Profile

	if r.Method != http.MethodPost {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	err := json.NewDecoder(r.Body).Decode(&updateRequest)
	if err != nil {
		http.Error(w, "Erro ao decodificar JSON", http.StatusBadRequest)
		return
	}

	if updateRequest.Email == "" {
		http.Error(w, "Email não fornecido", http.StatusBadRequest)
		return
	}

	var existingUser models.Profile
	result := dataBase.DB.Table("users").Where("email = ?", updateRequest.Email).First(&existingUser)

	if result.Error == gorm.ErrRecordNotFound {
		http.Error(w, "Usuário não encontrado", http.StatusNotFound)
		return
	}

	if result.Error != nil {
		http.Error(w, "Erro ao consultar usuário", http.StatusInternalServerError)
		return
	}

	updateQuery := "UPDATE users SET bio = ? WHERE email = ?"
	updateResult := dataBase.DB.Exec(updateQuery, updateRequest.Bio, updateRequest.Email)

	if updateResult.Error != nil {
		http.Error(w, "Erro ao atualizar biografia", http.StatusInternalServerError)
		return
	}

	fmt.Println("Biografia atualizada com sucesso!")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Biografia atualizada com sucesso"))
}

// Atualiza a senha quando o usuário já sabe a própria senha
func RefreshPassword(w http.ResponseWriter, r *http.Request) {
	var passwordUpdate models.Password
	err := json.NewDecoder(r.Body).Decode(&passwordUpdate)
	if err != nil {
		http.Error(w, "Erro ao decodificar JSON", http.StatusBadRequest)
		return
	}

	var existingUser models.User
	result := dataBase.DB.Where("email = ?", passwordUpdate.Email).First(&existingUser)
	if result.Error == gorm.ErrRecordNotFound {
		http.Error(w, "Usuário não encontrado", http.StatusNotFound)
		return
	}

	if existingUser.Password != passwordUpdate.Password {
		http.Error(w, "Senha atual incorreta", http.StatusUnauthorized)
		return
	}

	updateResult := dataBase.DB.Model(&existingUser).Where("email = ?", passwordUpdate.Email).
		Update("password", passwordUpdate.NewPassword)

	if updateResult.Error != nil {
		http.Error(w, "Erro ao atualizar a senha", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Senha atualizada com sucesso"))
}

// Atualiza a senha quando o usuário esqueceu a senha atual
func ResetPassword(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
        return
    }

    var passwordReset struct {
        Email string `json:"email"`
    }

    err := json.NewDecoder(r.Body).Decode(&passwordReset)
    if err != nil {
        http.Error(w, "Erro ao decodificar JSON", http.StatusBadRequest)
        log.Println("Erro ao decodificar JSON:", err)
        return
    }

    if passwordReset.Email == "" {
        http.Error(w, "Email não fornecido", http.StatusBadRequest)
        log.Println("Email não fornecido")
        return
    }

    var existingUser models.User
    result := dataBase.DB.Where("email = ?", passwordReset.Email).First(&existingUser)
    if result.Error == gorm.ErrRecordNotFound {
        http.Error(w, "Usuário não encontrado", http.StatusNotFound)
        log.Println("Usuário não encontrado:", passwordReset.Email)
        return
    }

    if result.Error != nil {
        http.Error(w, "Erro ao buscar usuário", http.StatusInternalServerError)
        log.Println("Erro ao buscar usuário:", result.Error)
        return
    }

    // Gere um token único para a redefinição de senha
    token, err := generateResetToken()
    if err != nil {
        http.Error(w, "Erro ao gerar token de redefinição de senha", http.StatusInternalServerError)
        log.Println("Erro ao gerar token de redefinição de senha:", err)
        return
    }

    // Defina a data de expiração do token (por exemplo, 1 hora a partir de agora)
    expiresAt := time.Now().Add(12 * time.Hour)

    // Armazene o token na tabela password_resets
    resetEntry := models.PasswordReset{
        Email:     passwordReset.Email,
        Token:     token,
        ExpiresAt: expiresAt,
    }
    result = dataBase.DB.Create(&resetEntry)
    if result.Error != nil {
        http.Error(w, "Erro ao armazenar token de redefinição de senha", http.StatusInternalServerError)
        log.Println("Erro ao armazenar token de redefinição de senha:", result.Error)
        return
    }

    // Gere um link de redefinição de senha
    resetLink := fmt.Sprintf("http://localhost:8000/updatePassword?email=%s&token=%s", passwordReset.Email, token)
    log.Println("Link de redefinição de senha gerado:", resetLink)

    // Envie o e-mail de redefinição de senha
    err = sendResetEmail(passwordReset.Email, resetLink)
    if err != nil {
        http.Error(w, "Erro ao enviar e-mail de redefinição de senha", http.StatusInternalServerError)
        log.Println("Erro ao enviar e-mail de redefinição de senha:", err)
        return
    }

    w.WriteHeader(http.StatusOK)
    w.Write([]byte("E-mail de redefinição de senha enviado com sucesso"))
    log.Println("E-mail de redefinição de senha enviado com sucesso para:", passwordReset.Email)
}

func UpdatePassword(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
        return
    }

    var passwordUpdate struct {
        Email       string `json:"email"`
        Token       string `json:"token"`
        NewPassword string `json:"newPassword"`
    }

    err := json.NewDecoder(r.Body).Decode(&passwordUpdate)
    if err != nil {
        http.Error(w, "Erro ao decodificar JSON", http.StatusBadRequest)
        log.Println("Erro ao decodificar JSON:", err)
        return
    }

    if passwordUpdate.Email == "" || passwordUpdate.Token == "" || passwordUpdate.NewPassword == "" {
        http.Error(w, "Dados incompletos", http.StatusBadRequest)
        log.Println("Dados incompletos")
        return
    }

    // Verifique o token na tabela password_resets
    var resetEntry models.PasswordReset
    result := dataBase.DB.Where("email = ? AND token = ?", passwordUpdate.Email, passwordUpdate.Token).First(&resetEntry)
    if result.Error == gorm.ErrRecordNotFound {
        http.Error(w, "Token inválido ou expirado", http.StatusUnauthorized)
        log.Println("Token inválido ou expirado:", passwordUpdate.Email)
        return
    }

    if result.Error != nil {
        http.Error(w, "Erro ao buscar token de redefinição de senha", http.StatusInternalServerError)
        log.Println("Erro ao buscar token de redefinição de senha:", result.Error)
        return
    }

    // Verifique se o token expirou
    if time.Now().After(resetEntry.ExpiresAt) {
        http.Error(w, "Token expirado", http.StatusUnauthorized)
        log.Println("Token expirado:", passwordUpdate.Email)
        return
    }

    var existingUser models.User
    result = dataBase.DB.Where("email = ?", passwordUpdate.Email).First(&existingUser)
    if result.Error == gorm.ErrRecordNotFound {
        http.Error(w, "Usuário não encontrado", http.StatusNotFound)
        log.Println("Usuário não encontrado:", passwordUpdate.Email)
        return
    }

    if result.Error != nil {
        http.Error(w, "Erro ao buscar usuário", http.StatusInternalServerError)
        log.Println("Erro ao buscar usuário:", result.Error)
        return
    }

    // Atualize a senha do usuário
    updateResult := dataBase.DB.Model(&existingUser).Update("password", passwordUpdate.NewPassword)
    if updateResult.Error != nil {
        http.Error(w, "Erro ao atualizar a senha", http.StatusInternalServerError)
        log.Println("Erro ao atualizar a senha:", updateResult.Error)
        return
    }

    // Remova o token da tabela password_resets após o uso
    dataBase.DB.Delete(&resetEntry)

    w.WriteHeader(http.StatusOK)
    w.Write([]byte("Senha atualizada com sucesso"))
    log.Println("Senha atualizada com sucesso para:", passwordUpdate.Email)
}