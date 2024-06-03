import ranges from './ranges.js';
import encontrarBitcoins from './bitcoin-find.js';
import readline from 'readline';
import chalk from 'chalk';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let key = 0;
let min, max = 0;

const startProcessing = (answer, option, optionValue) => {
    if (parseInt(answer) < 1 || parseInt(answer) > 160) {
        console.log(chalk.bgRed('Erro: voce precisa escolher um numero entre 1 e 160'));
        process.exit(1);
    }

    min = ranges[answer - 1].min;
    max = ranges[answer - 1].max;
    console.log('Carteira escolhida: ', chalk.cyan(answer), ' Min: ', chalk.yellow(min), ' Max: ', chalk.yellow(max));
    console.log('Numero possivel de chaves:', chalk.yellow(parseInt(BigInt(max) - BigInt(min)).toLocaleString('pt-BR')));
    key = BigInt(min);

    if (option == '2') {
        if (parseFloat(optionValue) > 1 || parseFloat(optionValue) < 0) {
            console.log(chalk.bgRed('Erro: voce precisa escolher um numero entre 0 e 1'));
            process.exit(1);
        }

        const range = BigInt(max) - BigInt(min);
        const percentualRange = range * BigInt(Math.floor(parseFloat(optionValue) * 1e18)) / BigInt(1e18);
        min = BigInt(min) + BigInt(percentualRange);
        console.log('Comecando em: ', chalk.yellow('0x' + min.toString(16)));
        key = BigInt(min);
        encontrarBitcoins(key, min, max);
    } else if (option == '3') {
        min = BigInt(optionValue);
        key = BigInt(min);
        encontrarBitcoins(key, min, max);
    } else {
        encontrarBitcoins(key, min, max);
    }
    rl.close();
};

const wallet = process.env.WALLET || process.argv[2];
const option = process.env.OPTION || process.argv[3];
const optionValue = process.env.OPTION_VALUE || process.argv[4];

if (wallet && option) {
    startProcessing(wallet, option, optionValue);
} else {
    rl.question(`Escolha uma carteira puzzle( ${chalk.cyan(1)} - ${chalk.cyan(160)}): `, (answer) => {
        rl.question(`Escolha uma opcao (${chalk.cyan(1)} - Comecar do inicio, ${chalk.cyan(2)} - Escolher uma porcentagem, ${chalk.cyan(3)} - Escolher minimo): `, (answer2) => {
            if (answer2 == '2') {
                rl.question('Escolha um numero entre 0 e 1: ', (answer3) => {
                    startProcessing(answer, answer2, answer3);
                });
            } else if (answer2 == '3') {
                rl.question('Entre o minimo: ', (answer3) => {
                    startProcessing(answer, answer2, answer3);
                });
            } else {
                startProcessing(answer, answer2, null);
            }
        });
    });
}

rl.on('SIGINT', () => {
    rl.close();
    process.exit();
});

process.on('SIGINT', () => {
    console.log(chalk.yellow('\nGracefully shutting down from SIGINT (Ctrl+C)'));
    rl.close();
    process.exit();
});
