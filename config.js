// ========== CONFIGURAÇÃO DOS PRODUTOS ==========
// Cada modelo tem suas próprias configurações

const PRODUTOS = {
  
  'vazou': {
    nome: 'Mirella',
    bot_url: 'https://t.me/Mirella_bot?start=pixrmirella',
    grupo_vip: 'https://t.me/+LINK_GRUPO_MIRELLA',
    foto: 'https://i.postimg.cc/FOTO_MIRELLA.jpg',
    cor_primaria: '#ff6b9d',
    cor_secundaria: '#c44569'
  },
  



// Função para pegar dados do produto pela utm_campaign
function getProduto() {
  const params = new URLSearchParams(window.location.search);
  const campaign = params.get('utm_campaign') || 'bia';
  return PRODUTOS[campaign] || PRODUTOS['bia'];
}

// Função para pegar APENAS o grupo VIP
function getGrupoVIP() {
  const params = new URLSearchParams(window.location.search);
  const campaign = params.get('utm_campaign') || 'bia';
  const produto = PRODUTOS[campaign] || PRODUTOS['bia'];
  return produto.grupo_vip;
}
