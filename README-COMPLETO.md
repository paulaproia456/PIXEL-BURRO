# 🎯 Sistema Multi-Modelo de Tracking Facebook Ads → Telegram

Sistema completo para rastrear vendas de **VÁRIOS MODELOS** no Facebook Ads, personalizando automaticamente cada campanha.

## ✨ O Que Este Sistema Faz

- **1 sistema** para **múltiplos produtos/modelos**
- Personaliza automaticamente: foto, cores, bot, grupo VIP
- Trackeia vendas no Facebook com o evento **Purchase**
- Cada modelo tem sua própria configuração

## 📋 Como Funciona

```
Facebook Ads (utm_campaign=bia) 
    ↓
Presell (foto da Bia, cores da Bia)
    ↓
Bot da Bia
    ↓
Compra Aprovada
    ↓
Obrigado (redireciona pro grupo VIP da Bia)
    ↓
Facebook recebe Purchase com valor
```

## 🚀 Deploy no Netlify

### Passo 1: Fazer Upload

**Opção A: Arrastar e Soltar**
1. Acesse: https://app.netlify.com/drop
2. Arraste TODOS os 4 arquivos:
   - `presell.html`
   - `obrigado.html`
   - `config.js`
   - `netlify.toml`
3. Anote a URL: `https://seu-site.netlify.app`

**Opção B: Via GitHub**
```bash
git init
git add .
git commit -m "Sistema multi-modelo tracking"
git remote add origin https://github.com/SEU_USER/SEU_REPO.git
git push -u origin main
```

Depois conecte no Netlify.

## ⚙️ Configuração

### 1. Editar config.js (MAIS IMPORTANTE!)

Abra o `config.js` e configure seus modelos:

```javascript
const PRODUTOS = {
  '
  },
  
  'mirella': {
    nome: 'Mirella',
    bot_url: 'https://t.me/Mirella_bot?start=adsmirella',
    grupo_vip: 'https://t.me/+LINK_GRUPO_MIRELLA',
    foto: 'https://i.postimg.cc/FOTO_MIRELLA.jpg',
    cor_primaria: '#ff6b9d',
    cor_secundaria: '#c44569'
  }
  
  // Adicione quantos quiser!
};
```

### 2. Trocar Pixel ID

Edite **presell.html** (linha ~19) e **obrigado.html** (linha ~19):

```javascript
fbq('init', '221008055755103'); // ← TROCAR PELO SEU PIXEL ID
```

## 📱 Como Usar nos Anúncios do Facebook

### Para a Bia:
```
https://seu-site.netlify.app/presell.html?utm_campaign=bia
```

### Para a Mirella:
```
https://seu-site.netlify.app/presell.html?utm_campaign=mirella
```

### Para Vazados:
```
https://seu-site.netlify.app/presell.html?utm_campaign=vazados
```

**O sistema detecta automaticamente e personaliza tudo!**

## 🤖 Configurar o Bot do Telegram

Quando o pagamento for aprovado, seu bot precisa enviar um botão com:

```
https://seu-site.netlify.app/obrigado.html?value=17.90&utm_campaign=bia
```

### Exemplo em Python:

```python
from telegram import InlineKeyboardButton, InlineKeyboardMarkup

async def apos_pagamento(update, context, valor, modelo):
    # modelo = 'bia', 'mirella', 'vazados', etc
    url = f"https://seu-site.netlify.app/obrigado.html?value={valor}&utm_campaign={modelo}"
    
    keyboard = [[InlineKeyboardButton("🎉 Entrar no Grupo VIP", url=url)]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "✅ *Pagamento Aprovado!*\n\n"
        "Clique no botão para entrar no grupo VIP:",
        parse_mode='Markdown',
        reply_markup=reply_markup
    )
```

### Exemplo em Node.js:

```javascript
const { Markup } = require('telegraf');

async function aposPagamento(ctx, valor, modelo) {
  const url = `https://seu-site.netlify.app/obrigado.html?value=${valor}&utm_campaign=${modelo}`;
  
  await ctx.reply(
    '✅ *Pagamento Aprovado!*\n\nClique no botão para entrar no grupo VIP:',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.url('🎉 Entrar no Grupo VIP', url)]
      ])
    }
  );
}
```

## 📊 O Que o Facebook Vai Receber

### Para cada venda:

```json
{
  "event_name": "Purchase",
  "value": 17.90,
  "currency": "BRL",
  "content_name": "Bia Miranda",
  "content_category": "bia"
}
```

Você consegue ver no **Facebook Ads Manager**:
- Quantas vendas cada modelo fez
- Valor total de cada campanha
- ROAS de cada modelo

## 🎨 Adicionar Mais Modelos

### Passo 1: Editar config.js

```javascript
'novo_modelo': {
  nome: 'Nome da Modelo',
  bot_url: 'https://t.me/Bot_bot?start=ads',
  grupo_vip: 'https://t.me/+LINK_GRUPO',
  foto: 'https://link-da-foto.jpg',
  cor_primaria: '#FF0000',
  cor_secundaria: '#880000'
}
```

### Passo 2: Criar anúncio com:

```
https://seu-site.netlify.app/presell.html?utm_campaign=novo_modelo
```

Pronto! Tudo funciona automaticamente.

## 🧪 Testar o Sistema

### Teste da Bia:
```
https://seu-site.netlify.app/presell.html?utm_campaign=bia
```

### Teste da Mirella:
```
https://seu-site.netlify.app/presell.html?utm_campaign=mirella
```

### Teste do Obrigado:
```
https://seu-site.netlify.app/obrigado.html?value=25.90&utm_campaign=bia
```

Veja no console do navegador (F12) os eventos sendo enviados!

## 🎨 Escolher Cores

Use este site para pegar cores: https://coolors.co/

Exemplo de gradientes bonitos:

```javascript
// Rosa forte
cor_primaria: '#ff4da6'
cor_secundaria: '#6a0dad'

// Roxo elegante
cor_primaria: '#667eea'
cor_secundaria: '#764ba2'

// Vermelho quente
cor_primaria: '#ff6b6b'
cor_secundaria: '#c44569'

// Azul calmo
cor_primaria: '#4facfe'
cor_secundaria: '#00f2fe'
```

## 📁 Estrutura dos Arquivos

```
📦 Projeto
 ┣ 📜 config.js         # ⭐ Configuração dos modelos
 ┣ 📜 presell.html      # Página de entrada
 ┣ 📜 obrigado.html     # Página de confirmação
 ┣ 📜 netlify.toml      # Config do Netlify
 ┗ 📜 README.md         # Este arquivo
```

## ❓ FAQ

**P: Posso ter quantos modelos?**
R: Quantos quiser! Só adicionar no `config.js`

**P: Como sei qual modelo vendeu mais?**
R: No Facebook Ads Manager, filtre por `content_category`

**P: Preciso criar páginas separadas?**
R: NÃO! Uma página serve pra todos, o `utm_campaign` muda automaticamente

**P: E se não passar utm_campaign?**
R: Usa o padrão (Bia)

**P: Funciona com a API do Facebook?**
R: SIM! O Pixel já envia via API automaticamente

## 🎯 Exemplo Completo

### Anúncio da Bia no Facebook:
```
URL: https://seu-site.netlify.app/presell.html?utm_campaign=bia
```

### Usuário clica:
- Vê foto da Bia
- Vê cores da Bia
- É redirecionado pro bot da Bia

### Usuário compra no bot:
Bot envia: `obrigado.html?value=17.90&utm_campaign=bia`

### Página de obrigado:
- Mostra "R$ 17,90"
- Envia Purchase pro Facebook
- Redireciona pro grupo VIP da Bia

### Facebook recebe:
```
Purchase: R$ 17,90
Modelo: Bia Miranda
Campanha: bia
```

---

**Pronto pra usar! 🚀**

Dúvidas? É só chamar!
