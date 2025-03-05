package controllers

import (
    "crypto/rand"
    "encoding/base64"
    "log"
    "net/smtp"
)

// Função para enviar o e-mail de redefinição de senha
func sendResetEmail(to, resetLink string) error {
    from := "gfigteste@gmail.com"
    password := "wszx logg cuze nfqp"

    // Configurações do servidor SMTP do Gmail
    smtpHost := "smtp.gmail.com"
    smtpPort := "587"

    // Mensagem do e-mail
    message := []byte("Subject: Redefinição de Senha\n\n" +
        "Para redefinir sua senha, clique no link a seguir:\n" + resetLink)

    // Autenticação
    auth := smtp.PlainAuth("", from, password, smtpHost)

    // Envio do e-mail
    err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, message)
    if err != nil {
        log.Println("Erro ao enviar e-mail:", err)
        return err
    }

    log.Println("E-mail enviado com sucesso para:", to)
    return nil
}

// Função para gerar um token único
func generateResetToken() (string, error) {
    b := make([]byte, 32)
    _, err := rand.Read(b)
    if err != nil {
        log.Println("Erro ao gerar token:", err)
        return "", err
    }
    return base64.URLEncoding.EncodeToString(b), nil
}