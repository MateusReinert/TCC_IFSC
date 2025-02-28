FROM golang:1.22.4

WORKDIR /app

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

RUN go mod tidy
RUN go build -o main .

EXPOSE 8000

CMD ["./main"]