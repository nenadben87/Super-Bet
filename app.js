const confirmWindow = document.querySelector('.confirm-window');
const myTicket = document.querySelector('.my-ticket');
const navigation = document.querySelector('nav');

const chevronDown = document.querySelector('.fa-chevron-down');
const ticketBody = document.querySelector('.ticket-body');
const ticketFooter = document.querySelector('.ticket-footer');

const gamesDiv = document.querySelector('.games');

const columnes = document.querySelectorAll('.column');

const totalBet = document.querySelector('.total-bet');

const betSum = document.querySelector('.bet-sum');
const winSum = document.querySelector('.win-sum');
const payment = document.querySelector('.payment');
const paymentInput = document.querySelector('.payment-input');

const sendTicket = document.querySelector('.send-ticket');
const clearMatches = document.querySelector('.clear-matches');

const payTicket = document.querySelector('.pay-ticket');
const cancelPayment = document.querySelector('.cancel-payment');

let gamesInc = 0;

let objArr = [];
let betArr = [];

let betTotal;

if(localStorage.length > 0){
  objArr = JSON.parse(localStorage.getItem('tickets'));
}

chevronDown.addEventListener('click', () => {
  ui.showMyTicket();
});

document.addEventListener('DOMContentLoaded', loadYourMatches);
sendTicket.addEventListener('click', sendYourTicket);
clearMatches.addEventListener('click', clearYourTicket);
payment.addEventListener('keyup', addPayment);
ticketBody.addEventListener('click', removeMatch);
payTicket.addEventListener('click', payYourTicket);
cancelPayment.addEventListener('click', cancelYourPayment);

function loadYourMatches(){
  objArr.forEach((item) => {
    const matchPick = document.createElement('div');
    const paragraph = document.createElement('p');
    const pickDescription = document.createElement('div');

    matchPick.className = 'match-pick';
    pickDescription.className = 'pick-description';

    paragraph.appendChild(document.createTextNode(item.opponents));
    pickDescription.innerHTML = `<span>${item.pick}</span><span>${item.bet}</span> <span><i class="fa-solid fa-xmark"></i></span>`;
    
    matchPick.appendChild(paragraph);
    matchPick.appendChild(pickDescription);

    const totalBet = document.querySelector('.total-bet');

    ticketBody.insertBefore(matchPick, totalBet);

    betArr.push(item.bet);

    if(pickDescription.firstChild.textContent === 'OU 0-2'){
      pickDescription.style.marginLeft = '7.8rem';
    }
    if(pickDescription.firstChild.textContent === 'FR 2' || pickDescription.firstChild.textContent === 'FR 1' || pickDescription.firstChild.textContent === 'FR X'){
      pickDescription.style.marginLeft = '140px';
    }
  });

  gamesDiv.classList.add('active');
  gamesInc = objArr.length;
  gamesDiv.textContent = gamesInc;
  if(objArr.length < 1){
    gamesDiv.classList.remove('active');
  }

  betSum.textContent = betArr.reduce((a,b) => a * b).toFixed(2);
}

function sendYourTicket(){
  const alert = document.querySelector('.alert')
  if(paymentInput.value === ''){
     alert.innerHTML += `<p style="margin-bottom:0.5rem;">Place your bet!</p>`;
     setTimeout(() => {
      alert.innerHTML = '';
     },3000)
  } else if(localStorage.length === 0){
    alert.innerHTML += `<p>Add matches to your Ticket!</p>`;
     setTimeout(() => {
      alert.innerHTML = '';
     },3000)
  } else {
    objArr.forEach((item) => {
      const confirmBody = document.querySelector('.confirm-body');
      const sum = document.querySelector('.sum');

      const matchPickConfirm = document.createElement('div');
      const paragraph = document.createElement('p');
      const pickDiscConfirm = document.createElement('div');

      matchPickConfirm.className = 'match-pick-confirm';
      pickDiscConfirm.className = 'pick-description-confirm';

      paragraph.appendChild(document.createTextNode(item.opponents));

      pickDiscConfirm.innerHTML = `<span>${item.pick}</span>
                                   <span>${item.bet}</span>`;

      matchPickConfirm.appendChild(paragraph);
      matchPickConfirm.appendChild(pickDiscConfirm);

      confirmBody.insertBefore(matchPickConfirm, sum);
    })

    confirmWindow.classList.add('active');

    const totalBetConfirm = document.querySelector('.total-bet-confirm');
    const paymentConfirm = document.querySelector('.payment-confirm');
    const potentialWinConfirm = document.querySelector('.potential-win-confirm');

    totalBetConfirm.innerHTML = `<span>Total Bet:</span> 
                                <span style="font-weight:bold;">${betSum.textContent}</span>`;

    paymentConfirm.innerHTML = `<span>Payment: ${paymentInput.value}</span> 
                               <span><i class="fa-solid fa-euro-sign"></i></span>`;

    potentialWinConfirm.innerHTML = `<span>Potential Win:</span>
                        <span style="font-weight:bold;">${winSum.textContent}</span>`;
  }

  ui.styleElements();
}

function clearYourTicket(){
  const matchPicks = document.querySelectorAll('.match-pick');
    matchPicks.forEach((matchPick) => {
      matchPick.remove();
    })
    localStorage.clear();
    objArr = [];
    betArr = [];
    gamesInc = 0;
    gamesDiv.classList.remove('active');
    betSum.textContent = '0.00';
    winSum.textContent = '0.00';
    paymentInput.value = '';
}

function addPayment(){
  let potentialWin = Number(paymentInput.value) * Number(betSum.textContent)
  winSum.textContent = potentialWin.toFixed(2);
}

function removeMatch(e){
  if(e.target.classList.contains('fa-xmark')){
      e.target.parentElement.parentElement.parentElement.remove();
      gamesInc--;
      gamesDiv.textContent = gamesInc;

      if(gamesInc < 1){
        gamesDiv.classList.remove('active');
      }

      objArr.splice(0, objArr.length);
      betArr.splice(0, betArr.length);

      const matchPicks = document.querySelectorAll('.match-pick');
      matchPicks.forEach((matchPick) => {
        const opponents = matchPick.firstChild.textContent;
        const pick = matchPick.children[1].children[0].textContent;
        const bet = matchPick.children[1].children[1].textContent;

        const ticket = {
          opponents: opponents,
          pick: pick,
          bet: bet
        }

        objArr.push(ticket);
        betArr.push(ticket.bet);
      })

      localStorage.setItem('tickets',JSON.stringify(objArr));

      if(betArr.length < 2){
        betTotal = betArr[0];
      } else if(betArr.length > 1){
        betTotal = betArr.reduce((a,b) => a * b);
      } else if(betArr.length < 1){
        betTotal = 0;
      }

      const num = Number(betTotal);

      betSum.textContent = num.toFixed(2);
      betArr.splice(0, betArr.length);
      betArr.push(betTotal);

      const potentialWin = betTotal * paymentInput.value;

      if(paymentInput.value === ''){
        paymentInput.value = 0;
      }
      winSum.textContent = potentialWin.toFixed(2);
      if(matchPicks.length < 1){
        winSum.textContent = '0.00';
        betSum.textContent = '0.00';
      }
  }
}

function payYourTicket(){
  const matchPicks = document.querySelectorAll('.match-pick');
    matchPicks.forEach((matchPick) => {
      matchPick.remove();
    })
    localStorage.clear();
    objArr = [];
    betArr = [];
    gamesInc = 0;
    gamesDiv.classList.remove('active');
    betSum.textContent = '0.00';
    winSum.textContent = '0.00';
    paymentInput.value = '';
    confirmWindow.classList.remove('active');

    myTicket.style.zIndex = '1';
    navigation.children[0].style.zIndex = '1';
    navigation.children[1].style.zIndex = '1';
}

function cancelYourPayment(){
  confirmWindow.classList.remove('active');
  myTicket.style.zIndex = '1'; 
  
  const matchPicksConf = document.querySelectorAll('.match-pick-confirm');
  matchPicksConf.forEach((match) => {
    match.remove();
  })

  navigation.children[0].style.zIndex = '1';
  navigation.children[1].style.zIndex = '1';
}

columnes.forEach((column) => {
  column.addEventListener('click', (e) => {
    if(e.target.classList.contains('column-3') || e.target.classList.contains('column-4') || e.target.classList.contains('column-5') || e.target.classList.contains('column-6') || e.target.classList.contains('column-7')){

    ui.increaseGame();

    let opponents;
    let pick;
    let bet = e.target.textContent;

    if(e.target.classList.contains('column-3')){
      opponents = e.target.previousElementSibling.textContent;
      pick = 'FR 1';
    }
    if(e.target.classList.contains('column-4')){
      opponents = e.target.previousElementSibling.previousElementSibling.textContent;
      pick = 'FR X';
    }
    if(e.target.classList.contains('column-5')){
      opponents = e.target.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
      pick = 'FR 2';
    }
    if(e.target.classList.contains('column-6')){
      opponents = e.target.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
      pick = 'OU 0-2';
    }
    if(e.target.classList.contains('column-7')){
      opponents = e.target.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
      pick = 'OU 3+';
    }

    const ticket = {
      opponents: opponents,
      pick: pick,
      bet: bet
    }

    objArr.push(ticket);

    localStorage.setItem('tickets',JSON.stringify(objArr));
    
    betArr.push(ticket.bet);
    if(typeof (betArr[0]) == 'undefined'){
      betArr.shift();
    }

    if(betArr.length < 2){
      betTotal = betArr[0];
    } else if(betArr.length > 1){
      betTotal = betArr.reduce((a,b) => a * b);
    } else if(betArr.length < 1){
      betTotal = 0;
    }
    
    const matchPick = document.createElement('div');
    matchPick.className = 'match-pick';
    matchPick.innerHTML += `<p>${opponents}</p>
    <div class="pick-description">
     <span>${pick}</span><span>${bet}</span> <span><i class="fa-solid fa-xmark"></i></span>
    </div>`;

    ticketBody.insertBefore(matchPick,totalBet);
    
    const num = Number(betTotal);
    betSum.textContent = num.toFixed(2);

    const potentialWin = betTotal * paymentInput.value;
    if(paymentInput.value === ''){
      paymentInput.value = 0;
    }

    winSum.textContent = potentialWin.toFixed(2);

    if(matchPick.children[1].firstElementChild.textContent === 'OU 0-2'){
      matchPick.children[1].style.marginLeft = '7.8rem';
    }
    if(matchPick.children[1].firstElementChild.textContent === 'FR 2' || matchPick.children[1].firstElementChild.textContent === 'FR 1' || matchPick.children[1].firstElementChild.textContent === 'FR X'){
      matchPick.children[1].style.marginLeft = '140px';
    }
    }
    
  })
})

class UI {
  showMyTicket(){
    chevronDown.classList.toggle('active');
    ticketBody.classList.toggle('active');
    ticketFooter.classList.toggle('active');
  }

  increaseGame(){
    gamesInc++;
    gamesDiv.classList.add('active');
    gamesDiv.textContent = gamesInc;
  }

  styleElements(){
    if(confirmWindow.classList.contains('active')){
      myTicket.style.zIndex = '-1';
      navigation.children[0].style.zIndex = '-1';
      navigation.children[1].style.zIndex = '-1';
    }
  }
}

const ui = new UI();

console.log(objArr);
console.log(betArr);
//localStorage.clear();