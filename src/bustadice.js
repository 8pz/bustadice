var config = {
    globalHeader: { label: "", type: "noop" },
    risk_factor: { label: "Amount Skipped Multiplier on Red", type: "multiplier", value: 1.0 },
    targets_arr: { label: "~ Minimum Multiplier - Maximum Multiplier", type: "text", value: "~5-30" },
    baseBet: { label: "Base Bet on RED", type: "balance", value: 100 },
    minProfit: { label: "Loss Before Stopping Script", type: "balance", value: -10000 },
    maxProfit: { label: "Profit Before Stopping Script", type: "balance", value: 100000 },
} 

var max_rollss = -1;
var risk_multiplierr = 0.0001;
var basebet_percent_amountt = -1;
var risk_basee = 1;
var targett = 20;
var stww = 40;
 
var rules = {
    risk_factor: config.risk_factor.value,          
    risk_multiplier: risk_multiplierr,  
    risk_base: risk_basee,             
    interval: 1,                                 
    skip_enabled: true,
    auto_betting: true,                         
    multiply_classic: true,                      
    DEBUG: false,
 
    experiment: false,                              
    max_rolls: max_rollss,              
    added_iterations: 5,                          
    iterations_target_higher: 80,
    iterations_target_lower: 4,
    iterations_risk_factor_lower: 0.5,
    difficult_game: 14,
    game_area_to_play: 4,
    quadripile: 2,
    basebet_percent: true,                                                        
    basebet_percent_amount: basebet_percent_amountt,                    
};

 
async function makeResults(num){
    let results = [];
    for(let i = 0; i < num; i++){
        results.push(Math.max(1, Math.min(1e6, Math.round((0.99 / Math.random()) * 100) / 100)));
    }
    return results;
}
 
function getNonce(nonce){
    return predeterminated_numbers[nonce]
}
var current_nonce = 0;
var predeterminated_numbers = makeResults(3000)
 
var wins = 0;
var loses = 0;

async function makeRun(games){
    for (let i = 0; i < games; i++){
        current_nonce += 1;
        var multiplier = predeterminated_numbers[current_nonce]
        console.log(`Outcome: ${multiplier}x`)
        if (multiplier >= 2){
            wins++;
        } else {
            loses++;
        }
        console.log(`Wins: ${wins} | Loses: ${loses}`)
        await sleep(2)
    }
}

const main = async () => {
    var skipStep = 1, rolls = 0, Strategies = [], engine = this, attempt = 0, PROFIT = 0, minProfit = config.minProfit.value, maxProfit = config.maxProfit.value,
        start_play = false, currentPayout = 1.01, currentBet = config.baseBet.value, STATES = { WAITING: -1 }, active = STATES.WAITING, runs = 0, context = this, iterations = 5;
 
    class Permissions {
        constructor () {
 
            this.script_name = ``;
            this.script_ver = 1.01;       
            this.script_author = ``;  
            this.contact_info = ``;  
            this.script_description = ``;
            this.users = [``];
            this.server_time;
            this.runningMinutes = new Date().setMinutes(0);
            this.DEBUG = false;
            this.ACCESSED = false;
 
            try {
                this.user = userInfo.uname;
                if (this.DEBUG) console.log(``);
 
            } catch (e) {
                this.user = context.username;
                if (this.DEBUG) console.log(``);
            }
        }
 
        addUser(username) { this.users.push(username); }
 
        currentDateDay() {
            if (this.server_time == undefined) return
 
            var res = this.server_time.substring(this.server_time.length - 2, this.server_time.length + 1);
            var final = res
            for (let i = 0; i < 2; i++) {
                if (res[ 0 ] == "0") {
                    final = res.substring(2, 1)
                }
            }
 
            return Number(final)
        }
 
        currentDateMonth() {
            if (this.server_time == undefined) return
 
            let res = this.server_time.substring(5, 7);
            let final = res
            for (let i = 0; i < 2; i++) {
                if (res[ 0 ] == "0") {
                    final = res.substring(2, 1);
                }
            }
            return Number(final)
        }
 
        currentDateYear() {
            if (this.server_time == undefined) { return }
 
            return Number(this.server_time.substring(0, 4))
        }
 
        currentDate(eu_format = false) {
            let build_date = "";
 
            if (eu_format == false) {
                build_date = `${this.currentDateYear()}-${this.currentDateMonth()}-${this.currentDateDay()}`;
                if (this.DEBUG) { console.log("West date format: ", build_date); }
            } else {
                build_date = `${this.currentDateDay()}-${this.currentDateMonth()}-${this.currentDateYear()}`;
                if (this.DEBUG) { console.log("Europe date format: ", build_date); }
            }
 
            return build_date
        }
 
        async getServerTime() {
            const { timestamp } = await context.skip();
            let time_stamp = "";
 
            for (let i = 0; i < 10; i++) {
                time_stamp += timestamp[ i ];
            }
            this.server_time = time_stamp;
        }
 
        currentTime() {
            this.hours = new Date().getHours();
            this.minutes = new Date().getMinutes();
 
            return Number(this.hours)
        }
 
        updatePermissions() {
            return True
        }
    }
 
    class Target {
        constructor (target, basebet, streak) {
            this.target = target;
            if (target === undefined) {
                console.clear();
                return 0
            }
            this.basebet = basebet * rules.risk_base;
 
            this.game_ls = 0;
            this.game_stw = this.streak;
            if (this.game_stw == 0) { this.game_stw = 1; }
 
            this.streak = streak;
            this.roll = 0;
            this.max_rolls = -1;
 
            if (basebet === undefined) {
                if (rules.basebet_percent){
                    this.basebet = getPercent(rules.basebet_percent_amount) * rules.risk_base;
                } else {
                    this.basebet = config.baseBet.value * rules.risk_base;
                }
 
                if (rules.DEBUG) { console.log(`this.basebet = ${this.basebet}`); }
            }
            if (streak === undefined) {
                this.streak = Math.floor(calculate_stw(target));
                if (rules.DEBUG) { console.log(`this.streak = ${this.streak}`); }
            }
            this._addPayout(this.target, streak);
 
            console.log(`${target}x created, with streak ${this.streak}`);
        };
 
        _addPayout(payout, streak) {
            if (streak === undefined) {
                this.game_stw = calculate_stw(payout);
            } else {
                this.game_stw = streak;
            }
            Strategies.push(this)
 
        }
        ChangeStreakToWait(value) {
            this.game_stw = value;
            this.game_ls = 0;
        }
 
    }
 
    async function fastBet(bet = 200, target = 60) {
        var rules_fastbets = {
            betAmount: bet,
            Target: target,
            queueSize: Math.ceil(target / rules.quadripile),
        }
 
        var betCount = 0, totalOut = 0, totalIn = 0, queue = new Array(rules_fastbets.queueSize), running = true;
 
        const doResult = async function (result) {
            totalIn++;
            await updateStreaks(result.multiplier, false);
            console.log(`Bet: ${rules_fastbets.betAmount / 100}, Target: ${rules_fastbets.Target}, Outcome: ${result.multiplier}x`)
            if (result.multiplier >= rules_fastbets.Target){
                PROFIT += roundBit(rules_fastbets.betAmount * (rules_fastbets.Target - 1));
                console.log(`${totalIn} | ${PROFIT / 100}: PROFIT++ ${roundBit(rules_fastbets.betAmount * (rules_fastbets.Target - 1)) / 100}`)
            } else {
                PROFIT -= roundBit(rules_fastbets.betAmount);
                console.log(`${totalIn} | ${PROFIT / 100}: PROFIT-- ${roundBit(rules_fastbets.betAmount) / 100}`)
            }
 
        }
 
        const fastbets = async function () {
            while (running) {
                for (let i = 0; i < rules_fastbets.queueSize; i++) {
                    await checkConditions();
                    queue[ i ] = engine.bet(rules_fastbets.betAmount, rules_fastbets.Target), betCount++ , totalOut++;
 
                    await sleep(1);
                }
                if (running) {
                    await Promise.all(queue.map(p => p.catch(e => e))).then(async (results) => {
                        await results.forEach(result => doResult(result))
                    });
                    running = !running;
                }
            }
        }
        await fastbets();
    }
 
    function readInputCommand() {
        var targets_arr = config.targets_arr.value;
 
        if (targets_arr != "") {
            if (targets_arr.startsWith("~")) {
                readRange(targets_arr.replace("~", ""), "-");
                return
            }
            if (targets_arr == Number(0)) {
                for (let i = 3; i < 100; i = i + 3) { new Target(i); }
                for (let i = 150; i < 1000; i = i + 25) { new Target(i); }
                return
            }
            if (targets_arr.startsWith("=")) {
                readTwoArgs(targets_arr.replace("=", ""));
                return
            }
            if (targets_arr.startsWith("rules")) {
                console.log("In next update");
                return
            }
 
        } else {
            new Target(targett, config.baseBet.value, stww);
        }
    }
 
    function readTwoArgs(input, seperator_args = ":", separator_elements = ",") {
        let splits = input;
        let st_second = splits.split(seperator_args && separator_elements);
        for (let i = 0; i < st_second.length; i++) {
            let st_t = st_second[ i ];
            if (st_t.search(seperator_args) != -1) {
                let args_build = "";
                let args2_build = "";
                for (let j = st_t.search(seperator_args) + 1; j < st_second[ i ].length; j++) {
                    args_build += st_second[ i ][ j ];
                }
                for (let jy = 0; jy < st_t.search(seperator_args); jy++) {
                    args2_build += st_second[ i ][ jy ];
                }
                new Target(Number(args2_build), undefined, args_build);
            }
            if (st_second[ i ].search(seperator_args) == -1) {
                new Target(Number(st_second[ i ].trim()));
            }
        }
    }
 
    function readRange(input, seperator_args = "-", separator_elements = ",") {
        let splits = input;
        let st_second = splits.split(seperator_args && separator_elements);
        for (let i = 0; i < st_second.length; i++) {
            let st_t = st_second[ i ];
            if (st_t.search(seperator_args) != -1) {
                let args_build = "";
                let args2_build = "";
                for (let j = st_t.search(seperator_args) + 1; j < st_second[ i ].length; j++) {
                    args_build += st_second[ i ][ j ];
                }
                for (let jy = 0; jy < st_t.search(seperator_args); jy++) {
                    args2_build += st_second[ i ][ jy ];
                }
 
                let num1 = Number(args2_build);
                let num2 = Number(args_build);
 
                if (typeof num1 === "number" && typeof num2 === "number") {
                    for (let i = num1; i <= num2; i += num1) {
                        new Target(i, config.baseBet.value);
                    }
                } else {
                    console.log(`Error creating target [${args2_build}-${args_build}]`)
                }
            }
        }
    }
 
    async function updateStreaks(multiplier, logs = true) {
        let output = ``;
 
        for (let i = 0; i < Strategies.length; i++) {
            if (multiplier < Strategies[ i ].target) {
                Strategies[ i ].game_ls++;
 
            } else if (multiplier > Strategies[ i ].target) {
                Strategies[ i ].game_ls = 0;
            }
        }
 
        if (Strategies.length > 500) {
            output = `Too much targets(${Strategies.length}) to show logging for each`;
        } else {
            for (let i = 0; i < Strategies.length; i++) {
                output += ` | ${Strategies[ i ].target}x: ${Strategies[ i ].game_ls}/${Math.floor(Strategies[ i ].game_stw)}`;
            }
        }
        if (logs){
            await engine.clearLog();
            await engine.log(`Rolls: ${rolls} |  Profit ${Math.round(PROFIT / 100)} bits` + `\n ${output}`);
        }
    }
 
    function calculate_stw(target) {
        let stw = Math.floor((target * rules.difficult_game) / rules.game_area_to_play * config.risk_factor.value);
        if (stw == 0) {
            return 1
        } else {
            return stw
        }
    }
 
    async function analyzeBet(context) {
        let result = rules.skip_enabled ? skipStep ? await context.bet(100, 1.01) : await context.skip() : await context.bet(100, 1.01);
        skipStep = !skipStep;
        return result
    }
 
    function getPercent(percent){ return roundBit(engine.balance / 100 * percent); }
 
    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }
 
    function roundBit(bet) { return Math.max(100, Math.round((bet) / 100) * 100) }
 
    function getMul(target) { return (1 / (target - 1) + 1) + rules.risk_multiplier }
 
    function ChangeStreakToWaits(value) {
        for (let i = 0; i < Strategies.length; i++) {
            Strategies[ i ].ChangeStreakToWait(value);
        }
    }
 
 
    async function checkConditions(){
        let output = `Stopping due to min/max profit | Profit: ${Math.round(PROFIT / 100)} bits`;
        if (PROFIT > maxProfit || PROFIT - currentBet < minProfit) {
            await engine.log(output);
            await engine.stop();
        }
    }
 
    if (rules.basebet_percent_amount == -1){ rules.basebet_percent = false; }
 
    const origBet = this.bet;
    const origSkip = this.skip;
 
    this.bet = async function () {
 
        return origBet.apply(this, arguments);
    }
    this.skip = async function () {
 
 
        return origSkip.apply(this, arguments);
    }

    var perms = new Permissions();
    perms.addUser('');
    await perms.getServerTime();
    perms.updatePermissions();
    readInputCommand();
 
    const count = 5;
    var counter = 0;
 
    while (true) {

        if (iterations > 0) {
            await fastBet(roundBit(currentBet / 2), Math.floor(currentPayout / 2));
            iterations--;
        }
        rolls++;
        if (start_play) {
            await engine.log(`Playing ${Strategies[ active ].target}x | Bet ${roundBit(currentBet) / 100} | Multiplier ${getMul(currentPayout).toFixed(2)} | Streak ${Strategies[ active ].roll}`);
            await checkConditions();
            var { multiplier } = await this.bet(roundBit(currentBet), currentPayout);
 
            await updateStreaks(multiplier);
 
            Strategies[ active ].roll += 1;
 
            let temp = active;
            if (rules.max_rolls != -1 && Strategies[ active ].roll >= rules.max_rolls) {
                Strategies[ active ].roll = 0;
                start_play = false;
                if (iterations <= 0){
                    iterations = Math.floor(currentPayout / 2);
                }
 
                if (rules.basebet_percent){
                    currentBet = getPercent(rules.basebet_percent_amount) * rules.risk_base;
                } else {
                    currentBet = Strategies[ active ].basebet * rules.risk_base;
                }
                temp = active;
                active = STATES.WAITING;
            }
            if (rules.iterations_target_lower == -1 || rules.iterations_target_higher == -1) { rules.experiment = false; }
 
            if (multiplier < currentPayout) {
                PROFIT -= roundBit(currentBet);
                if (rules.multiply_classic == true) {
                    currentBet *= getMul(currentPayout);
                } else {
                    attempt++;
                    if (attempt == Math.round(currentPayout)) {
                        attempt = 0;
                        currentBet *= 2;
                    }
                }
            } else {
                PROFIT += roundBit(currentBet * (currentPayout - 1));
                if (rules.basebet_percent){
                    currentBet = getPercent(rules.basebet_percent_amount) * rules.risk_base;
                } else {
                    currentBet = Strategies[ temp ].basebet * rules.risk_base;
                }
                start_play = false;
                runs++;
                await engine.log(`${Strategies[ temp ].target}x Won at streak ${Strategies[ temp ].roll} roll.`);
                Strategies[ temp ].roll = 0;
 
                temp = STATES.WAITING;
                active = STATES.WAITING;
            }
        } else {
            if (active == STATES.WAITING)  {
                const { multiplier } = await analyzeBet(this);
                updateStreaks(multiplier)
            }
        }
 
        for (let i = 0; i < Strategies.length; i++) {
 
            if (Strategies[ i ].game_ls >= Strategies[ i ].game_stw && active == STATES.WAITING) {
                if (rules.auto_betting) {
                    start_play = true;
                    currentPayout = Strategies[ i ].target;
                    if (rules.basebet_percent){
                        currentBet = getPercent(rules.basebet_percent_amount) * rules.risk_base;
                    } else {
                        currentBet = Strategies[ i ].basebet * rules.risk_base;
                    };
 
                    attempt = 0;
                    Strategies[ i ].roll = 0;
                    Strategies[ i ].game_ls = 0;
                    active = i;
                } else {
                    engine.log(`${Strategies[ i ].target}x catched! Rolls ${rolls}, Streak rows ${Strategies[ i ].game_ls}/${Math.floor(Strategies[ i ].game_stw)}`);
                    engine.stop();
                }
            }
        }
        await sleep(rules.interval);
    }
}

while (true) {
    try {
        await main();
    }
    catch (error) {
        if (error.message === "connection closed") {
            engine.log("Attempting restart");
            continue;
        } else if (error.message === "insufficient balance") {
            engine.log("Insufficient balance");
            engine.stop();
        } else {
            throw error;
        }
    }
}