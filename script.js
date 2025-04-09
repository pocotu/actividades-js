// Inicializar datos de la encuesta
let surveyData = {
    "JavaScript": 0,
    "Python": 0,
    "Java": 0,
    "C#": 0,
    "PHP": 0,
    "TypeScript": 0,
    "C++": 0,
    "Ruby": 0,
    "Go": 0,
    "Swift": 0,
    "Kotlin": 0,
    "Rust": 0
};

// Array para almacenar preguntas dinámicas
let dynamicQuestions = [];

// Referencia al gráfico
let resultsChart;

// Obtener variables CSS para usar en el JS
function getCSSVariable(variableName) {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

// Navegación de scroll
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el gráfico principal
    initChart();
    
    // Inicializar listeners para formularios
    setupFormListeners();
});

// Inicializar el gráfico
function initChart() {
    const ctx = document.getElementById('resultsChart').getContext('2d');
    
    // Obtener colores desde CSS
    const colorLight = getCSSVariable('--color-light');
    const colorDark = getCSSVariable('--color-dark');
    const colorWhite = getCSSVariable('--color-white');
    const colorTextLight = getCSSVariable('--color-text-light');
    
    // Configuración de colores en tono verde-azulado
    const backgroundColor = [
        'rgba(106, 207, 199, 0.8)',
        'rgba(106, 207, 199, 0.75)',
        'rgba(106, 207, 199, 0.7)',
        'rgba(106, 207, 199, 0.65)',
        'rgba(106, 207, 199, 0.6)',
        'rgba(106, 207, 199, 0.55)',
        'rgba(106, 207, 199, 0.5)',
        'rgba(106, 207, 199, 0.45)',
        'rgba(106, 207, 199, 0.4)',
        'rgba(106, 207, 199, 0.35)',
        'rgba(106, 207, 199, 0.3)',
        'rgba(106, 207, 199, 0.25)'
    ];
    
    const borderColor = [
        'rgba(106, 207, 199, 1)',
        'rgba(106, 207, 199, 0.95)',
        'rgba(106, 207, 199, 0.9)',
        'rgba(106, 207, 199, 0.85)',
        'rgba(106, 207, 199, 0.8)',
        'rgba(106, 207, 199, 0.75)',
        'rgba(106, 207, 199, 0.7)',
        'rgba(106, 207, 199, 0.65)',
        'rgba(106, 207, 199, 0.6)',
        'rgba(106, 207, 199, 0.55)',
        'rgba(106, 207, 199, 0.5)',
        'rgba(106, 207, 199, 0.45)'
    ];
    
    resultsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(surveyData),
            datasets: [{
                label: 'Votos',
                data: Object.values(surveyData),
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: 'rgba(255, 255, 255, 0.8)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Lenguajes de Programación Favoritos',
                    font: {
                        size: 18,
                        family: 'Poppins'
                    },
                    color: colorWhite,
                    padding: 20
                },
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: colorDark,
                    titleFont: {
                        family: 'Poppins'
                    },
                    bodyFont: {
                        family: 'Poppins'
                    },
                    borderColor: colorLight,
                    borderWidth: 1
                }
            }
        }
    });
}

// Actualizar el gráfico con nuevos datos
function updateChart() {
    resultsChart.data.labels = Object.keys(surveyData);
    resultsChart.data.datasets[0].data = Object.values(surveyData);
    resultsChart.update();
}

// Función para configurar todos los listeners de formularios
function setupFormListeners() {
    // Manejar el envío del formulario de encuesta
    document.getElementById('surveyForm').addEventListener('submit', handleSurveySubmit);
    
    // Agregar nueva pregunta
    document.getElementById('addQuestionForm').addEventListener('submit', handleAddQuestion);
}

// Manejar el envío del formulario de encuesta
function handleSurveySubmit(e) {
    e.preventDefault();
    
    // Obtener el valor seleccionado para la pregunta principal
    const languageSelected = document.querySelector('input[name="language"]:checked');
    
    // Obtener colores CSS
    const colorDark = getCSSVariable('--color-dark');
    const colorLight = getCSSVariable('--color-light');
    const colorWhite = getCSSVariable('--color-white');
    
    // Verificar si se seleccionó una opción
    if (languageSelected) {
        surveyData[languageSelected.value]++;
        updateChart();
        
        // Animación de éxito
        animateSuccess();
        
        // Mostrar notificación
        Swal.fire({
            title: '¡Gracias!',
            text: 'Tu respuesta ha sido registrada.',
            icon: 'success',
            background: colorDark,
            color: colorWhite,
            iconColor: colorLight,
            confirmButtonColor: colorLight
        });
        
        // Resetear el formulario
        document.getElementById('surveyForm').reset();
        
        // Desplazarse automáticamente a los resultados
        setTimeout(() => {
            document.getElementById('results').scrollIntoView({
                behavior: 'smooth'
            });
        }, 1500);
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Por favor selecciona una opción antes de enviar.',
            icon: 'error',
            background: colorDark,
            color: colorWhite,
            iconColor: colorLight,
            confirmButtonColor: colorLight
        });
    }
    
    // Procesar preguntas dinámicas
    dynamicQuestions.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name="dynamicQuestion${index}"]:checked`);
        if (selectedOption) {
            question.data[selectedOption.value]++;
            
            // Actualizar el gráfico de la pregunta dinámica
            if (question.chart) {
                const dataValues = Object.values(question.data);
                question.chart.data.datasets[0].data = dataValues;
                question.chart.update();
            }
        }
    });
}

// Agregar nueva pregunta
function handleAddQuestion(e) {
    e.preventDefault();
    
    const questionText = document.getElementById('questionText').value.trim();
    const optionsText = document.getElementById('questionOptions').value.trim();
    
    // Obtener colores CSS
    const colorDark = getCSSVariable('--color-dark');
    const colorLight = getCSSVariable('--color-light');
    const colorWhite = getCSSVariable('--color-white');
    
    if (questionText === '' || optionsText === '') {
        Swal.fire({
            title: 'Error',
            text: 'Por favor completa todos los campos.',
            icon: 'error',
            background: colorDark,
            color: colorWhite,
            iconColor: colorLight,
            confirmButtonColor: colorLight
        });
        return;
    }
    
    const options = optionsText.split('\n').filter(option => option.trim() !== '');
    
    if (options.length < 2) {
        Swal.fire({
            title: 'Error',
            text: 'Debes agregar al menos dos opciones.',
            icon: 'error',
            background: colorDark,
            color: colorWhite,
            iconColor: colorLight,
            confirmButtonColor: colorLight
        });
        return;
    }
    
    // Crear objeto de datos para la nueva pregunta
    const questionData = {};
    options.forEach(option => {
        questionData[option] = 0;
    });
    
    // Agregar pregunta al array
    dynamicQuestions.push({
        question: questionText,
        options: options,
        data: questionData
    });
    
    // Renderizar la nueva pregunta en el formulario
    renderDynamicQuestions();
    
    // Crear un gráfico para la nueva pregunta
    const questionIndex = dynamicQuestions.length - 1;
    const chartId = `dynamicChart${questionIndex}`;
    
    setTimeout(() => {
        const chartElement = document.getElementById(chartId);
        if (!chartElement) {
            console.error('No se encontró el elemento del gráfico:', chartId);
            return;
        }
        
        const ctx = chartElement.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: options,
                datasets: [{
                    data: Array(options.length).fill(0),
                    backgroundColor: generateGreenBlueColors(options.length),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: questionText,
                        font: {
                            size: 16,
                            family: 'Poppins'
                        },
                        color: colorWhite,
                        padding: 15
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: colorWhite,
                            font: {
                                family: 'Poppins'
                            },
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: colorDark,
                        titleFont: {
                            family: 'Poppins'
                        },
                        bodyFont: {
                            family: 'Poppins'
                        },
                        borderColor: colorLight,
                        borderWidth: 1
                    }
                }
            }
        });
        
        // Guardar referencia al gráfico
        dynamicQuestions[questionIndex].chart = chart;
    }, 300); // Aumentado el tiempo para asegurar que el DOM esté listo
    
    // Limpiar el formulario
    document.getElementById('addQuestionForm').reset();
    
    // Mostrar notificación
    Swal.fire({
        title: 'Pregunta Añadida',
        text: 'La nueva pregunta ha sido agregada a la encuesta.',
        icon: 'success',
        background: colorDark,
        color: colorWhite,
        iconColor: colorLight,
        confirmButtonColor: colorLight
    });
    
    // Desplazarse a la sección de la encuesta
    setTimeout(() => {
        document.getElementById('survey').scrollIntoView({
            behavior: 'smooth'
        });
    }, 1500);
}

// Renderizar preguntas dinámicas
function renderDynamicQuestions() {
    const container = document.getElementById('dynamicQuestions');
    if (!container) {
        console.error('No se encontró el contenedor para preguntas dinámicas');
        return;
    }
    
    // Limpiar el contenedor
    container.innerHTML = '';
    
    // Si no hay preguntas, no hacer nada más
    if (dynamicQuestions.length === 0) {
        return;
    }
    
    // Agregar un título para la sección si es la primera pregunta
    if (dynamicQuestions.length === 1) {
        const sectionTitle = document.createElement('h4');
        sectionTitle.textContent = 'Preguntas adicionales';
        sectionTitle.className = 'mt-4 mb-3';
        container.appendChild(sectionTitle);
    }
    
    // Renderizar cada pregunta
    dynamicQuestions.forEach((question, index) => {
        const card = document.createElement('div');
        card.className = 'card mb-4';
        
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        
        const questionTitle = document.createElement('h5');
        questionTitle.textContent = question.question;
        questionTitle.className = 'highlight';
        cardBody.appendChild(questionTitle);
        
        // Crear una cuadrícula para las opciones
        const optionsGrid = document.createElement('div');
        optionsGrid.className = 'language-grid';
        
        // Opciones de respuesta
        question.options.forEach(option => {
            const optionItem = document.createElement('div');
            optionItem.className = 'language-item';
            
            const input = document.createElement('input');
            input.className = 'language-radio';
            input.type = 'radio';
            input.name = `dynamicQuestion${index}`;
            input.id = `${option.replace(/\s+/g, '')}${index}`;
            input.value = option;
            
            const label = document.createElement('label');
            label.className = 'language-label';
            label.htmlFor = `${option.replace(/\s+/g, '')}${index}`;
            
            // Añadir icono al label
            const icon = document.createElement('i');
            icon.className = 'bi bi-code-square';
            
            // Añadir texto de la opción
            const textSpan = document.createElement('span');
            textSpan.textContent = option;
            
            // Añadir elementos al label
            label.appendChild(icon);
            label.appendChild(textSpan);
            
            // Añadir elementos al optionItem
            optionItem.appendChild(input);
            optionItem.appendChild(label);
            
            // Añadir a la cuadrícula
            optionsGrid.appendChild(optionItem);
        });
        
        // Añadir cuadrícula al cuerpo de la tarjeta
        cardBody.appendChild(optionsGrid);
        
        // Gráfico para esta pregunta
        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container mt-3';
        chartContainer.style.height = '250px';
        
        const canvas = document.createElement('canvas');
        canvas.id = `dynamicChart${index}`;
        chartContainer.appendChild(canvas);
        
        cardBody.appendChild(chartContainer);
        card.appendChild(cardBody);
        container.appendChild(card);
    });
    
    // Asegurar que los estilos de los íconos sean circulares
    document.querySelectorAll('.language-label i').forEach(icon => {
        icon.style.width = '60px';
        icon.style.height = '60px';
        icon.style.display = 'flex';
        icon.style.alignItems = 'center';
        icon.style.justifyContent = 'center';
    });
}

// Generar colores en tonos verde-azulados
function generateGreenBlueColors(count) {
    // Obtener el color base desde CSS
    const baseColor = getCSSVariable('--color-light').replace('#', '');
    // Convertir a HSL para manipular más fácilmente
    const r = parseInt(baseColor.substr(0, 2), 16) / 255;
    const g = parseInt(baseColor.substr(2, 2), 16) / 255;
    const b = parseInt(baseColor.substr(4, 2), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0; // acromático
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
    }
    
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    const colors = [];
    for (let i = 0; i < count; i++) {
        // Variar el matiz ligeramente para cada opción
        const hue = (h + (i * 10)) % 360;
        // Variar ligeramente el brillo
        const lightness = Math.min(l + (i * 3), 70);
        colors.push(`hsla(${hue}, ${s}%, ${lightness}%, 0.8)`);
    }
    return colors;
}

// Configurar desplazamiento suave para los enlaces internos
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// Animación de éxito para formulario
function animateSuccess() {
    const formContainer = document.querySelector('#surveyForm').closest('.card');
    formContainer.classList.add('success-animation');
    
    setTimeout(() => {
        formContainer.classList.remove('success-animation');
    }, 1000);
} 