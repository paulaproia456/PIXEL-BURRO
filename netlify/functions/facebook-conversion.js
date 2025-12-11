const https = require('https');

// ========== CONFIGURAÇÕES ==========
const PIXEL_ID = process.env.FACEBOOK_PIXEL_ID || 'colocar Codigo do pixel do facebook';
const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.FACEBOOK_TEST_EVENT_CODE || null;

// Handler principal
exports.handler = async (event) => {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Responde OPTIONS (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Aceita apenas POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Valida Access Token
  if (!ACCESS_TOKEN) {
    console.error('❌ ACCESS_TOKEN não configurado!');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: 'Access Token não configurado no Netlify' 
      })
    };
  }

  try {
    // Parse dos dados recebidos
    const data = JSON.parse(event.body);
    
    // Captura IP do cliente
    const clientIP = event.headers['x-forwarded-for']?.split(',')[0] || 
                     event.headers['x-nf-client-connection-ip'] || 
                     event.headers['client-ip'] || '';
    
    console.log('📥 Purchase recebido:', {
      event_name: data.event_name,
      value: data.custom_data?.value,
      product: data.custom_data?.content_name,
      client_ip: clientIP
    });

    // Event ID único (usa o mesmo do Pixel)
    const eventId = data.event_id || `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Monta payload para Facebook Conversions API
    const payload = {
      data: [{
        event_name: data.event_name || 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: data.event_source_url || '',
        
        // Dados do usuário
        user_data: {
          client_ip_address: clientIP,
          client_user_agent: data.user_agent || '',
          fbp: data.fbp || null,
          fbc: data.fbc || null
        },
        
        // Dados da compra
        custom_data: data.custom_data || {}
      }],
      access_token: ACCESS_TOKEN
    };
    
    // Adiciona test_event_code se existir
    if (TEST_EVENT_CODE) {
      payload.test_event_code = TEST_EVENT_CODE;
      console.log('🧪 Test Event Code:', TEST_EVENT_CODE);
    }

    console.log('📤 Enviando para Facebook CAPI...');
    console.log('  - Event ID:', eventId);
    console.log('  - Pixel ID:', PIXEL_ID);
    console.log('  - FBP:', data.fbp ? 'OK' : 'N/A');
    console.log('  - FBC:', data.fbc ? 'OK' : 'N/A');
    console.log('  - IP:', clientIP || 'N/A');

    // Envia para Facebook
    const result = await sendToFacebook(payload, PIXEL_ID);
    
    console.log('✅ Resposta Facebook:', result);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        event_id: eventId,
        facebook_response: result
      })
    };

  } catch (error) {
    console.error('❌ Erro:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false,
        error: error.message 
      })
    };
  }
};

// Envia para Facebook Conversions API
function sendToFacebook(payload, pixelId) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    
    const options = {
      hostname: 'graph.facebook.com',
      path: `/v18.0/${pixelId}/events`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}
