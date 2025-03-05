package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/MateusReinert/TCC_IFSC/dataBase"
	"github.com/MateusReinert/TCC_IFSC/models"
	usersettings "github.com/MateusReinert/TCC_IFSC/models/userSettings"

	"gorm.io/gorm"
)

func PrivacyCombo(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	var privacySettings []usersettings.PrivacySetting
	result := dataBase.DB.Table("user_settings_privacy").Select("description, value").Find(&privacySettings)

	if result.Error != nil {
		http.Error(w, "Erro ao buscar configurações de privacidade", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(privacySettings); err != nil {
		http.Error(w, "Erro ao gerar resposta", http.StatusInternalServerError)
		return
	}
}

func ADDPrivacyCombo(w http.ResponseWriter, r *http.Request) {
	// Verifica se o método HTTP é POST
	if r.Method != http.MethodPost {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		log.Println("Método não permitido:", r.Method)
		return
	}

	// Estrutura para receber a requisição
	var privacyData struct {
		Email             string `json:"email"`
		PrivacidadePadrao uint   `json:"privacidadePadrao"`
	}

	// Decodifica o corpo da requisição
	err := json.NewDecoder(r.Body).Decode(&privacyData)
	if err != nil {
		http.Error(w, "Erro ao decodificar JSON", http.StatusBadRequest)
		log.Println("Erro ao decodificar JSON:", err)
		return
	}

	// Verifica se o email foi fornecido
	if privacyData.Email == "" {
		http.Error(w, "Email não fornecido", http.StatusBadRequest)
		log.Println("Email não fornecido na requisição.")
		return
	}

	// Verifica se o privacidadePadrao foi fornecido
	if privacyData.PrivacidadePadrao == 0 {
		http.Error(w, "ID de configuração não fornecido", http.StatusBadRequest)
		log.Println("ID de configuração não fornecido.")
		return
	}

	// Busca o usuário pelo email
	var existingUser models.User
	result := dataBase.DB.Where("email = ?", privacyData.Email).First(&existingUser)

	// Se o usuário não for encontrado
	if result.Error == gorm.ErrRecordNotFound {
		http.Error(w, "Usuário não encontrado", http.StatusNotFound)
		log.Println("Usuário não encontrado com o email:", privacyData.Email)
		return
	}

	// Se ocorrer algum erro na consulta ao banco
	if result.Error != nil {
		http.Error(w, "Erro ao buscar usuário", http.StatusInternalServerError)
		log.Println("Erro ao buscar usuário:", result.Error)
		return
	}

	// Log do usuário encontrado
	log.Println("Usuário encontrado:", existingUser.Email)

	// Verifica se a configuração com o privacidadePadrao já existe para o usuário
	var existingSetting models.UserSettings
	result = dataBase.DB.Where("user_id = ? AND setting_id = ?", existingUser.ID, privacyData.PrivacidadePadrao).First(&existingSetting)

	if result.Error == gorm.ErrRecordNotFound {
		// Se a configuração não existir, cria uma nova
		newSetting := models.UserSettings{
			UserID:    existingUser.ID,
			SettingID: privacyData.PrivacidadePadrao,
		}

		// Salva no banco de dados
		saveResult := dataBase.DB.Create(&newSetting)
		if saveResult.Error != nil {
			http.Error(w, "Erro ao salvar configuração de privacidade", http.StatusInternalServerError)
			log.Println("Erro ao salvar configuração de privacidade:", saveResult.Error)
			return
		}

		// Log de sucesso
		log.Println("Configuração de privacidade salva com sucesso para o usuário:", privacyData.Email)
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Configuração de privacidade salva com sucesso"))
	} else if result.Error != nil {
		http.Error(w, "Erro ao verificar configuração", http.StatusInternalServerError)
		log.Println("Erro ao verificar configuração:", result.Error)
	} else {
		// Se já existe a configuração, retornamos um erro ou uma resposta indicando que já foi configurado
		http.Error(w, "Configuração de privacidade já existe para este usuário", http.StatusConflict)
		log.Println("Configuração de privacidade já existe para o usuário:", privacyData.Email)
	}
}

func SensitivityPost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	var sensitivityPostSettings []usersettings.PrivacySetting
	result := dataBase.DB.Table("user_settings_sensitivity_post").Select("description, value").Find(&sensitivityPostSettings)

	if result.Error != nil {
		http.Error(w, "Erro ao buscar configurações de sensibilidade", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(sensitivityPostSettings); err != nil {
		http.Error(w, "Erro ao gerar resposta", http.StatusInternalServerError)
		return
	}
}

func ProfileVisibility(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	var profileVisibilitySettings []usersettings.PrivacySetting
	result := dataBase.DB.Table("user_settings_profile_visibility").Select("description, value").Find(&profileVisibilitySettings)

	if result.Error != nil {
		http.Error(w, "Erro ao buscar configurações de sensibilidade", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(profileVisibilitySettings); err != nil {
		http.Error(w, "Erro ao gerar resposta", http.StatusInternalServerError)
		return
	}
}

func ADDProfileVisibility(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	var privacyData struct {
		Email             string `json:"email"`
		PrivacidadePadrao uint   `json:"privacidadePadrao"`
	}

	if err := json.NewDecoder(r.Body).Decode(&privacyData); err != nil {
		http.Error(w, "Erro ao decodificar JSON", http.StatusBadRequest)
		return
	}

	if privacyData.Email == "" {
		http.Error(w, "Email não fornecido", http.StatusBadRequest)
		return
	}

	if privacyData.PrivacidadePadrao == 0 {
		http.Error(w, "ID de configuração inválido", http.StatusBadRequest)
		return
	}

	var existingUser models.User
	result := dataBase.DB.Where("email = ?", privacyData.Email).First(&existingUser)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "Usuário não encontrado", http.StatusNotFound)
			return
		}
		http.Error(w, "Erro ao buscar usuário", http.StatusInternalServerError)
		return
	}

	var existingSetting models.UserSettings
	result = dataBase.DB.Where("setting_id = ?", privacyData.PrivacidadePadrao).First(&existingSetting)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "Configuração não encontrada", http.StatusNotFound)
			return
		}
		http.Error(w, "Erro ao verificar configuração existente", http.StatusInternalServerError)
		return
	}

	result = dataBase.DB.Model(&existingSetting).Update("user_id", existingUser.ID)
	if result.Error != nil {
		http.Error(w, "Erro ao atualizar configuração", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Configuração de visibilidade de perfil atualizada com sucesso"))
}