package routes

import (
	"log"
	"net/http"

	"github.com/MateusReinert/TCC_IFSC/controllers"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func HandleRequest() {
	r := mux.NewRouter()
	r.HandleFunc("/register", controllers.Register).Methods("POST")
	r.HandleFunc("/login", controllers.Login).Methods("POST")
	r.HandleFunc("/perfilPage", controllers.RefreshBio).Methods("POST")
	r.HandleFunc("/senhaPage", controllers.RefreshPassword).Methods("POST")
	r.HandleFunc("/padroesDePrivacidade", controllers.PrivacyCombo).Methods("GET")
	r.HandleFunc("/padroesDePrivacidade", controllers.ADDPrivacyCombo).Methods("POST")
	r.HandleFunc("/sensibilidadeDeConteudoPage", controllers.SensitivityPost).Methods("GET")
	r.HandleFunc("/visibilidadeDoPerfilPage", controllers.ProfileVisibility).Methods("GET")
	r.HandleFunc("/visibilidadeDoPerfilPage", controllers.ADDProfileVisibility).Methods("POST")

	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)

	log.Fatal(http.ListenAndServe(":8000", corsHandler(r)))
}
