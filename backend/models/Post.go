package models

type Post struct {
	ID        uint   `gorm:"primaryKey"`                      // ID da postagem
	Title     string `gorm:"not null"`                        // Título da postagem
	Content   string `gorm:"not null"`                        // Conteúdo da postagem
	Image     []byte `gorm:"not null"`                        // Armazenando a imagem como bytea
	UserID    uint   `gorm:"not null"`                        // Chave estrangeira para associar ao usuário
	UserEmail string `gorm:"not null"`                        // Email do usuário (salvo diretamente na postagem)
	User      User   `gorm:"foreignKey:UserID;references:ID"` // Relacionamento com o modelo User
}
