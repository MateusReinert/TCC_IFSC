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

		user.UserType = "pending"
		user.Status = "ativo"

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

func ApproveOrRejectUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	// Pega o email do moderador a partir do cookie
	cookie, err := r.Cookie("email")
	if err != nil {
		http.Error(w, "Email do moderador não encontrado nos cookies", http.StatusUnauthorized)
		return
	}
	emailModerador := cookie.Value

	// Estrutura para capturar os dados enviados pelo frontend
	var requestData struct {
		ID   uint   `json:"id"`
		Role string `json:"role"` // agora aceitamos "user" ou "reproved"
	}

	err = json.NewDecoder(r.Body).Decode(&requestData)
	if err != nil {
		http.Error(w, "Erro ao decodificar JSON", http.StatusBadRequest)
		return
	}

	// Busca o usuário no banco de dados
	var user models.User
	result := dataBase.DB.First(&user, requestData.ID)
	if result.Error == gorm.ErrRecordNotFound {
		http.Error(w, "Usuário não encontrado", http.StatusNotFound)
		return
	}
	if result.Error != nil {
		http.Error(w, "Erro ao buscar usuário", http.StatusInternalServerError)
		return
	}

	// Verifica se o valor enviado é válido
	if requestData.Role != "user" && requestData.Role != "reproved" {
		http.Error(w, "Ação inválida. Use 'user' ou 'reproved'.", http.StatusBadRequest)
		return
	}

	// Atualiza o campo user_type com o valor enviado
	updateResult := dataBase.DB.Model(&user).Update("user_type", requestData.Role)
	if updateResult.Error != nil {
		http.Error(w, "Erro ao atualizar tipo de usuário", http.StatusInternalServerError)
		return
	}

	// Sucesso
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("Moderador '%s' atualizou usuário ID %d para '%s'", emailModerador, requestData.ID, requestData.Role)))
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

	// Verifica se o status do usuário é "inativo"
	if existingUser.Status == "inativo" {
		http.Error(w, "Usuário inativo. Entre em contato com o suporte.", http.StatusForbidden)
		return
	}

	// Verifica se o usuário foi aprovado (agora inclui "user", "admin" e "master")
	validRoles := map[string]bool{
		"user":   true,
		"admin":  true,
		"master": true,
	}

	if !validRoles[existingUser.UserType] {
		http.Error(w, "Usuário não aprovado. Entre em contato com o suporte.", http.StatusForbidden)
		return
	}

	// Verifica se a senha/email estão corretos
	if existingUser.Password != user.Password {
		http.Error(w, "Usuário ou senha inválidos", http.StatusUnauthorized)
		return
	}

	// Login realizado com sucesso
	fmt.Println("Login realizado com sucesso!")

	// Cria a resposta com o userId para ser utilizado no front-end
	response := map[string]interface{}{
		"userId": existingUser.ID,
	}

	// Envia a resposta com o userId
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// Ativar ou inativar um usuário
func ToggleUserStatus(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	// Estrutura para capturar o ID do usuário
	var requestData struct {
		ID uint `json:"id"`
	}

	err := json.NewDecoder(r.Body).Decode(&requestData)
	if err != nil {
		http.Error(w, "Erro ao decodificar JSON", http.StatusBadRequest)
		return
	}

	// Busca o usuário pelo ID
	var user models.User
	result := dataBase.DB.First(&user, requestData.ID)
	if result.Error == gorm.ErrRecordNotFound {
		http.Error(w, "Usuário não encontrado", http.StatusNotFound)
		return
	}

	if result.Error != nil {
		http.Error(w, "Erro ao buscar usuário", http.StatusInternalServerError)
		return
	}

	// Alterna o status do usuário
	newStatus := "ativo"
	if user.Status == "ativo" {
		newStatus = "inativo"
	}

	updateResult := dataBase.DB.Model(&user).Update("status", newStatus)
	if updateResult.Error != nil {
		http.Error(w, "Erro ao atualizar status do usuário", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("Status do usuário atualizado para '%s'", newStatus)))
}
func UpdateUserRole(w http.ResponseWriter, r *http.Request) {
	// Verifica se o método HTTP é PUT
	if r.Method != http.MethodPut {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	// Estrutura para capturar o ID do usuário a ser atualizado e a nova role
	var requestData struct {
		Email string `json:"requester_email"` // E-mail do solicitante
		ID    uint   `json:"id"`              // ID do usuário a ser atualizado
		Role  string `json:"role"`            // Valores esperados: "admin", "user" ou "master"
	}

	// Decodifica o corpo da requisição
	err := json.NewDecoder(r.Body).Decode(&requestData)
	if err != nil {
		http.Error(w, "Erro ao decodificar JSON", http.StatusBadRequest)
		return
	}

	// Log para verificar o requestData recebido
	fmt.Printf("Dados recebidos: E-mail do solicitante: %s, ID do usuário a ser alterado: %d, Nova Role: %s\n", requestData.Email, requestData.ID, requestData.Role)

	// Valida a role fornecida
	if requestData.Role != "admin" && requestData.Role != "user" && requestData.Role != "master" {
		http.Error(w, "Role inválida. Use 'admin', 'user' ou 'master'.", http.StatusBadRequest)
		return
	}

	// Busca o solicitante pelo e-mail fornecido
	var requester models.User
	result := dataBase.DB.Where("email = ?", requestData.Email).First(&requester)
	if result.Error == gorm.ErrRecordNotFound {
		http.Error(w, "Usuário solicitante não encontrado", http.StatusNotFound)
		return
	}

	// Verifica erros ao buscar o usuário solicitante
	if result.Error != nil {
		http.Error(w, "Erro ao buscar usuário solicitante", http.StatusInternalServerError)
		return
	}

	// Verifica se o usuário solicitante está ativo
	if requester.Status != "ativo" {
		http.Error(w, "Usuário solicitante está inativo. Permissão negada.", http.StatusForbidden)
		return
	}

	// Verifica se o usuário solicitante tem a role "master"
	if requester.UserType != "master" {
		http.Error(w, "Permissão negada. Apenas usuários com a role 'Master' podem atualizar roles.", http.StatusForbidden)
		return
	}

	// Busca o usuário a ser atualizado
	var user models.User
	result = dataBase.DB.First(&user, requestData.ID)
	if result.Error == gorm.ErrRecordNotFound {
		http.Error(w, "Usuário não encontrado", http.StatusNotFound)
		return
	}

	// Verifica erros ao buscar o usuário a ser atualizado
	if result.Error != nil {
		http.Error(w, "Erro ao buscar usuário", http.StatusInternalServerError)
		return
	}

	// Verifica se o userType do usuário é "reproved"
	if user.UserType == "reproved" {
		http.Error(w, "Usuário reprovado. Não é possível atualizar a role.", http.StatusForbidden)
		return
	}

	// Permite que o "master" altere sua própria role e a de outros usuários
	// Verifica se o usuário solicitante está tentando atualizar a própria role, mas permite para usuários 'master'
	if requester.ID == user.ID && requester.UserType != "master" {
		http.Error(w, "Usuário não pode alterar a própria role.", http.StatusForbidden)
		return
	}

	// Atualiza a role do usuário
	updateResult := dataBase.DB.Model(&user).Update("user_type", requestData.Role)
	if updateResult.Error != nil {
		http.Error(w, "Erro ao atualizar role do usuário", http.StatusInternalServerError)
		return
	}

	// Retorna sucesso
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("Role do usuário atualizada para '%s'", requestData.Role)))
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

func GetUserTypeByEmail(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	// Captura o e-mail do parâmetro da URL
	email := r.URL.Query().Get("email")
	if email == "" {
		http.Error(w, "E-mail não fornecido", http.StatusBadRequest)
		return
	}

	fmt.Printf("E-mail recebido: %s\n", email)

	var user models.User
	result := dataBase.DB.Where("email = ?", email).First(&user)
	if result.Error == gorm.ErrRecordNotFound {
		http.Error(w, "Usuário não encontrado", http.StatusNotFound)
		return
	}

	if result.Error != nil {
		http.Error(w, "Erro ao buscar usuário", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("Tipo de usuário: %s", user.UserType)))
}
