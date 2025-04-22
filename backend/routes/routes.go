package routes

import (
	"log"
	"net/http"

	"github.com/MateusReinert/TCC_IFSC/controllers"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

// HandleRequest configura todas as rotas do servidor
func HandleRequest() {
	r := mux.NewRouter()

	// Rota para o registro do usuário
	r.HandleFunc("/register", controllers.Register).Methods("POST")

	// Rota para o login do usuário
	r.HandleFunc("/login", controllers.Login).Methods("POST")

	// Rota para a atualização do perfil
	r.HandleFunc("/perfilPage", controllers.RefreshBio).Methods("POST")

	// Rota para a atualização da senha
	r.HandleFunc("/senhaPage", controllers.RefreshPassword).Methods("POST")

	// Rota para obter os padrões de privacidade
	r.HandleFunc("/padroesDePrivacidade", controllers.PrivacyCombo).Methods("GET")

	// Rota para adicionar novos padrões de privacidade
	r.HandleFunc("/padroesDePrivacidade", controllers.ADDPrivacyCombo).Methods("POST")

	// Rota para obter postagens sensíveis
	r.HandleFunc("/sensibilidadeDeConteudoPage", controllers.SensitivityPost).Methods("GET")

	// Rota para obter visibilidade do perfil
	r.HandleFunc("/visibilidadeDoPerfilPage", controllers.ProfileVisibility).Methods("GET")

	// Rota para adicionar visibilidade do perfil
	r.HandleFunc("/visibilidadeDoPerfilPage", controllers.ADDProfileVisibility).Methods("POST")

	// Rota para redefinir senha
	r.HandleFunc("/resetPassword", controllers.ResetPassword).Methods("POST")

	// Rota para atualizar senha
	r.HandleFunc("/updatePassword", controllers.UpdatePassword).Methods("POST")

	// Rota para criar uma postagem (POST)
	r.HandleFunc("/posts", controllers.CreatePost).Methods("POST")

	// Rota para editar uma postagem (PUT)
	r.HandleFunc("/edit-post", controllers.EditPost).Methods("PUT")

	// Rota para deletar uma postagem (DELETE)
	r.HandleFunc("/delete-post", controllers.DeletePost).Methods("DELETE")

	// Rota para buscar todas as postagens (GET)
	r.HandleFunc("/posts", controllers.GetPosts).Methods("GET")

	// Rota para fixar uma postagem (PUT)
	r.HandleFunc("/pin-post", controllers.PinPost).Methods("PUT")

	// Rota para desfixar uma postagem (PUT)
	r.HandleFunc("/unpin-post", controllers.UnpinPost).Methods("PUT")

	// Rota para criar um comentário em uma postagem (POST)
	r.HandleFunc("/create-comment", controllers.CreateComment).Methods("POST")

	// Rota para editar um comentário (PUT)
	r.HandleFunc("/edit-comment", controllers.EditComment).Methods("PUT")

	// Rota para deletar um comentário (DELETE)
	r.HandleFunc("/delete-comment", controllers.DeleteComment).Methods("DELETE")

	// Rota para listar comentários de uma postagem específica (GET)
	r.HandleFunc("/list-comments/{postId}", controllers.ListComments).Methods("GET")

	// Rota para listar os usuários (GET)
	r.HandleFunc("/users", controllers.GetUsers).Methods("GET")

	// Rota para alterar status do usuário entre ativo e inativo (PUT)
	r.HandleFunc("/toggleUserStatus", controllers.ToggleUserStatus).Methods("PUT")

	// Rota para aprovar/reprovar usuário (PUT)
	r.HandleFunc("/approveOrRejectUser", controllers.ApproveOrRejectUser).Methods("PUT")

	// Rota para atualizar a role de um usuário (PUT)
	r.HandleFunc("/updateUserRole", controllers.UpdateUserRole).Methods("PUT")

	// Rota para obter o tipo de usuário pelo e-mail (GET)
	r.HandleFunc("/get-user-type", controllers.GetUserTypeByEmail).Methods("GET")

	// Configuração do CORS
	corsHandler := handlers.CORS(
		// Permite a origem específica, e permite credenciais (cookies, cabeçalhos)
		handlers.AllowedOrigins([]string{"http://localhost:3000"}), // Origem específica
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
		handlers.AllowCredentials(), // Permite o envio de credenciais (cookies)
	)

	// Inicializa o servidor na porta 8000
	log.Fatal(http.ListenAndServe(":8000", corsHandler(r)))

}
