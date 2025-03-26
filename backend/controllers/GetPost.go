package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/MateusReinert/TCC_IFSC/dataBase"
	"github.com/MateusReinert/TCC_IFSC/models"
)

// GetPosts: Função para buscar todas as postagens
func GetPosts(w http.ResponseWriter, r *http.Request) {
	// Logando quando a função é chamada
	fmt.Println("Recebendo requisição para obter postagens")

	var posts []models.Post

	// Buscando todas as postagens no banco, ordenadas por data de criação em ordem decrescente (mais recentes primeiro)
	result := dataBase.DB.Order("created_at DESC").Find(&posts)
	if result.Error != nil {
		// Logando o erro ocorrido durante a consulta ao banco
		fmt.Println("Erro ao buscar postagens:", result.Error)
		http.Error(w, "Erro ao buscar postagens", http.StatusInternalServerError)
		return
	}

	// Logando o número de postagens encontradas
	fmt.Printf("Encontradas %d postagens\n", len(posts))

	// Configura o cabeçalho da resposta para JSON
	w.Header().Set("Content-Type", "application/json")

	// Codifica as postagens em JSON e envia para o front-end
	if err := json.NewEncoder(w).Encode(posts); err != nil {
		// Logando erro ao enviar resposta
		fmt.Println("Erro ao codificar as postagens para JSON:", err)
		http.Error(w, "Erro ao enviar postagens", http.StatusInternalServerError)
		return
	}

	// Logando sucesso ao enviar a resposta
	fmt.Println("Postagens enviadas com sucesso para o front-end")
}
