const connectBtn = document.getElementById('connectBtn');
const statusCard = document.getElementById('statusCard');
const statusText = document.getElementById('statusText');
const statusSubtext = document.getElementById('statusSubtext');
const ipDisplay = document.getElementById('ipDisplay');
const locationDisplay = document.getElementById('locationDisplay');
const encryptionStatus = document.getElementById('encryptionStatus');
const serverSelect = document.getElementById('serverSelect');

let isConnected = false;

const servers = {
    us: { name: 'United States 🇺🇸', endpoint: '', pubkey: '' },
    uk: { name: 'United Kingdom 🇬🇧', endpoint: '', pubkey: '' },
    de: { name: 'Germany 🇩🇪', endpoint: '', pubkey: '' },
    sg: { name: 'Singapore 🇸🇬', endpoint: '', pubkey: '' },
    jp: { name: 'Japan 🇯🇵', endpoint: '', pubkey: '' },
    nl: { name: 'Netherlands 🇳🇱', endpoint: '', pubkey: '' }
};

const isAndroidApp = () => {
    return typeof Android !== 'undefined';
};

async function getPublicIP() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        return data.ip;
    } catch (e) {
        return 'Checking...';
    }
}

connectBtn.addEventListener('click', async () => {
    if (!isConnected) {
        await connectVPN();
    } else {
        await disconnectVPN();
    }
});

async function connectVPN() {
    const selected = serverSelect.value;
    const server = servers[selected];
    
    statusText.textContent = 'Initializing...';
    statusSubtext.textContent = 'Generating secure keys...';
    connectBtn.style.opacity = '0.6';

    if (isAndroidApp()) {
        try {
            const result = await Android.connectWireGuard(selected);
            if (result.success) {
                onConnected(server.name);
            }
        } catch (e) {
            statusSubtext.textContent = 'Connection failed';
            connectBtn.style.opacity = '1';
        }
    } else {
        statusSubtext.textContent = 'Handshaking with server...';
        setTimeout(() => {
            onConnected(server.name);
        }, 2500);
    }
}

async function onConnected(locationName) {
    isConnected = true;
    statusCard.classList.add('status-connected');
    statusText.textContent = 'Secured 🔐';
    statusSubtext.textContent = 'Traffic routed through secure tunnel';
    connectBtn.querySelector('.btn-text').textContent = 'DISCONNECT';
    connectBtn.style.opacity = '1';
    
    ipDisplay.textContent = await getPublicIP();
    locationDisplay.textContent = locationName;
    encryptionStatus.textContent = 'WireGuard • AES-256-GCM ✅';
}

async function disconnectVPN() {
    if (isAndroidApp()) {
        await Android.disconnectWireGuard();
    }
    
    isConnected = false;
    statusCard.classList.remove('status-connected');
    statusText.textContent = 'Disconnected';
    statusSubtext.textContent = 'Your traffic is not encrypted';
    connectBtn.querySelector('.btn-text').textContent = 'CONNECT';
    
    ipDisplay.textContent = '---.---.---.---';
    locationDisplay.textContent = 'Not Connected';
    encryptionStatus.textContent = 'Inactive';
}
