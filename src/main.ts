import './style.css';
import { initExercise1 } from './exercicio1/Exercise1';
import { initExercise2 } from './exercicio1/Exercise2';
import { initExercise3 } from './exercicio1/Exercise3';
import { initChallenge } from './exercicio1/Challenge';

const app = document.querySelector<HTMLDivElement>('#app')!;

function clearApp() {
    app.innerHTML = '';
}

(window as any).loadExercise = (n: number) => {
    clearApp();
    if (n === 1) initExercise1(app);
    if (n === 2) initExercise2(app);
    if (n === 3) initExercise3(app);
};

(window as any).loadChallenge = () => {
    clearApp();
    initChallenge(app);
};

// Inicia com o primeiro
initExercise1(app);