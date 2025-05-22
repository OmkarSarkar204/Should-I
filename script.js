document.addEventListener('DOMContentLoaded', function() {
    const dilemmaInput = document.getElementById('dilemma');
    const askButton = document.getElementById('askButton');
    const clearButton = document.getElementById('clearButton');
    const proCard = document.getElementById('proCard');
    const conCard = document.getElementById('conCard');

   
    const API_KEY = "YOUR_API_KEY";//Enter your API key


    askButton.addEventListener('click', generateProsAndCons);
    dilemmaInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') generateProsAndCons();
    });
    clearButton.addEventListener('click', clearAll);

    async function generateProsAndCons() {
        const dilemma = dilemmaInput.value.trim();
        if (!dilemma) return alert('Please enter your question first!');

        showLoadingState();
        
        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    model: "llama3-70b-8192",
                    messages: [{ 
                        role: "user", 
                        content: `Give me 5 pros and 5 cons for: "${dilemma}".\nFormat:\nPROS:\n- Pro 1\n...\nCONS:\n- Con 1\n...` 
                    }],
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });

            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const data = await response.json();
            const { pros, cons } = parseResponse(data.choices[0].message.content);
            displayResults(pros, cons);

        } catch (error) {
            console.error('Error:', error);
            showErrorState();
        }
    }

    
    function showLoadingState() {
        proCard.innerHTML = '<h3>PROS</h3><div class="loading">Loading...</div>';
        conCard.innerHTML = '<h3>CONS</h3><div class="loading">Loading...</div>';
    }

    function parseResponse(text) {
        const pros = [], cons = [];
        let current = null;
        text.split('\n').forEach(line => {
            if (/PROS:/i.test(line)) current = pros;
            else if (/CONS:/i.test(line)) current = cons;
            else if (current && /^[-•*]\s/.test(line)) current.push(line.replace(/^[-•*]\s*/, ''));
        });
        return { pros, cons };
    }

    function displayResults(pros, cons) {
        proCard.innerHTML = '<h3>PROS</h3><ul>' + pros.map(p => `<li>${p}</li>`).join('') + '</ul>';
        conCard.innerHTML = '<h3>CONS</h3><ul>' + cons.map(c => `<li>${c}</li>`).join('') + '</ul>';
    }

    function showErrorState() {
        const msg = 'Error: Please check your API key and connection';
        proCard.innerHTML = `<h3>PROS</h3><p>${msg}</p>`;
        conCard.innerHTML = `<h3>CONS</h3><p>${msg}</p>`;
    }

    function clearAll() {
        dilemmaInput.value = '';
        proCard.innerHTML = '<h3>PROS</h3>';
        conCard.innerHTML = '<h3>CONS</h3>';
    }

    
    // MAGNETIC EFFECT
    const magneticButton = document.querySelector('.magnetic');
    const particleField = document.getElementById('particleField');

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.setProperty('--x', `${Math.random() * 200 - 100}px`);
        particle.style.setProperty('--y', `${Math.random() * 200 - 100}px`);
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animation = `particleFloat ${2 + Math.random() * 3}s infinite`;
        particleField.appendChild(particle);
    }

    magneticButton.addEventListener('mousemove', (e) => {
        const rect = magneticButton.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const distance = Math.min(Math.sqrt(x * x + y * y) / (rect.width / 2), 1);
        magneticButton.style.transform = `translate(${x * 0.3 * (1 - distance)}px, ${y * 0.3 * (1 - distance)}px)`;
    });

    magneticButton.addEventListener('mouseleave', () => {
        magneticButton.style.transform = 'translate(0, 0)';
    });
});
