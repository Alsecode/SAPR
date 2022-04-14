//Объект, содержащий таблицы
let tables = {
   rodsList: document.getElementById('RodsList'),
   listF: document.getElementById('listF'),
   listQ: document.getElementById('listQ'),
};

//Заполнение массивов со столбцами из таблиц
function fillArray(array, table, numberOfColumn) {
   for (let i = 0; i < table.rows.length; i++) {
      array[i] = table.rows[i].cells[numberOfColumn].firstChild.valueAsNumber;
   }
   return array;
}

let arraysOfColumns = {
   arrayL: [],
   arrayA: [],
   arrayE: [],
   arraySigma: [],
   arrayF: [],
   arrayQ: [],
}


//Добавление новой строки в таблицу
function appendRow(id, text, read, typeOfString) {
   let permission = text;
   let readOnly = read;
   let table = document.getElementById(id);
   length = table.length;
   row = table.insertRow(table.rows.length);

   for (let i = 0; i < table.rows[0].cells.length; i++) {
      createCell(row.insertCell(i), permission, readOnly, typeOfString);
   }

   for (let i = 0; i < table.rows.length; i++) {
      table.rows[i].cells[0].innerHTML = i + 1;
   }
}

//Задание атрибутов
function createCell(cell, permission, modifier, typeOfString) {
   let div = document.createElement('input');

   if (typeOfString == 'str2') {
      div.setAttribute('class', 'str2');
   }
   else {
      div.setAttribute('class', 'str');
   }

   div.setAttribute('type', 'number');
   if (permission === 'plusAndMinus') {
      div.setAttribute('onkeydown', "if (event.keyCode == 107) return false");
   }
   else {
      div.setAttribute('min', '0');
      div.setAttribute('onkeyup', "if(this.value<0) this.value=0");
      div.setAttribute('onkeydown', "if (event.keyCode == 107 || event.keyCode == 109) return false");
   }

   if (modifier === 'read') {
      div.setAttribute('readonly', true);
   }
   cell.appendChild(div);
}

//Удаление строки
function dltRow(id) {
   let table = document.getElementById(id);
   if (table.rows.length > 1) {
      table.deleteRow(table.rows.length - 1);
   }
}


//Визуализация введённых данных
function drawing() {
   //Проверка соответствия конструкции и нагрузок
   if (tables.listF.rows.length > tables.rodsList.rows.length + 1) {
      alert('Ошибка! Количество узлов отличается от количества стержней более, чем на 1');
      return;
   }
   if (tables.listQ.rows.length > tables.rodsList.rows.length) {
      alert('Ошибка! Количество погонных нагрузок на стержни больше, чем количество стержней');
      return;
   }
   if ((document.getElementById('left').checked == false) && (document.getElementById('right').checked == false)) {
      alert('Ошибка! Не выбрано ни одной опоры!');
      return;
   }

   let rodsRows = tables.rodsList.rows.length;

   //Заполнение массивов, содержащих введенные данные
   let arrayL = fillArray(arraysOfColumns.arrayL, tables.rodsList, 1);
   let arrayA = fillArray(arraysOfColumns.arrayA, tables.rodsList, 2);
   let arrayF = fillArray(arraysOfColumns.arrayF, tables.listF, 1);
   let arrayQ = fillArray(arraysOfColumns.arrayQ, tables.listQ, 1);

   //Получение холста
   let canvas = document.getElementById('canv');

   //Отрисовка конструкции
   if (canvas.getContext) {
      let ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      //Параметры стержня (ширина, высота)
      let width = 0;
      let currentHeight = 0;

      //Общая длина всех стержней
      let totalLengthL = 0;
      for (let r = 0, n = rodsRows; r < n; r++) {
         totalLengthL += arrayL[r];
      }
      //Общая площадь всех стержней
      let totalSquareA = 0;
      for (let r = 0, n = rodsRows; r < n; r++) {
         totalSquareA += arrayA[r];
      }

      //Коэффициенты для пропорционального распределения длины и площади между стержнями
      let coefL = 0;
      let coefA = 0;
      coefL = (canvas.width - 100) / totalLengthL;
      coefA = (canvas.height - 200) / totalSquareA;

      //Переменные для хранения картинок-стрелок состредоточенных и погонных нагрузок
      let picFleft = document.getElementById('picFleft');
      let picFright = document.getElementById('picFright');
      let picQleft = document.getElementById('picQleft');
      let picQright = document.getElementById('picQright');

      //Максимальная высота в конструкции
      let maxHeight = 0;

      //Координаты для рисования 
      let X = 50;
      let Y = 200;
      let startX = X - 20;
      let startY = Y;
      let endX = 0;
      let endY = 0;

      //Половины первого и последнего стержней
      let halfOfFirst = 0;
      let halfOfLast = 0;

      //Проверка на ноль
      for (let i = 0, n = rodsRows; i < n; i++) {
         if (!arrayA[i] || !arrayL[i]) {
            alert('Ошибка! Длина или площадь одного из стержней равна нулю!');
            return;
         }
      }

      for (let i = 0; i < rodsRows; i++) {
         //пропорциональные размеры текущего стержня
         width = arrayL[i] * coefL;
         currentHeight = arrayA[i] * coefA;

         //Поиск максимальной площади (высоты) для отрисовки опоры
         if (currentHeight > maxHeight) {
            maxHeight = currentHeight;
         }

         halfOfCurrentHeight = currentHeight / 2;
         let x = X;
         endX = X;
         endY = Y;
         let y = Y + currentHeight / 2;

         //Параметры для отрисовки сосредоточенной нагрузки
         let widthF = 60;
         let heightF = 50;
         let yF = y - 25;

         //Если в конструкции всего одинь стержень
         if (rodsRows === 1) {
            if (!arrayA[i] || !arrayL[i]) {
               alert('Ошибка! Длина или площадь стержня равна нулю!');
               return;
            }
            else {
               //Постоянные координаты стержня
               let widthOfFirst = 1350;
               let heightOfFirst = 350;
               let XofFirst = 50;
               let YofFirst = 50;
               let halfOfY = 225;

               //Отрисовка стержня
               ctx.strokeRect(XofFirst, YofFirst, widthOfFirst, heightOfFirst);

               //Отрисовка погонной нагрузки
               if (arrayQ[i] !== 0) {
                  X = widthOfFirst;
                  let xQ = XofFirst;
                  let yQ = halfOfY - 10;

                  //Ширина одной стрелки
                  let widthQ = 35;
                  //Высота одной стрелки
                  let heightQ = 20;

                  //Если погонная нагрузка положительна
                  if (arrayQ[i] > 0 && arrayQ[i]) {
                     do {
                        ctx.drawImage(picQright, xQ, yQ, widthQ, heightQ);
                        xQ += widthQ;
                     } while (xQ + widthQ <= X + XofFirst);
                  }
                  //Если погонная нагрузка отрицательна
                  else if (arrayQ[i] < 0) {
                     do {
                        ctx.drawImage(picQleft, xQ, yQ, widthQ, heightQ);
                        xQ += widthQ;
                     } while (xQ + widthQ <= X + XofFirst);
                  }
               }

               //Отрисовка сосредоточенных нагрузок
               //Координаты конца стержня
               let endOfFirst = widthOfFirst + 200;

               //Если нет опоры слева
               if (document.getElementById('left').checked == false) {
                  if (arrayF[0] > 0 && arrayF[0]) {
                     ctx.drawImage(picFright, XofFirst, halfOfY - 25, widthF, heightF);
                  }
                  else if (arrayF[0] < 0 && arrayF[0]) {
                     ctx.drawImage(picFleft, XofFirst - 55, halfOfY - 25, widthF, heightF);
                  }
               }
               //Если нет опоры справа
               if (document.getElementById('right').checked == false) {
                  if (arrayF[1] > 0 && arrayF[1]) {
                     ctx.drawImage(picFright, endOfFirst, halfOfY - 25, widthF, heightF);
                  }
                  else if (arrayF[1] < 0 && arrayF[1]) {
                     ctx.drawImage(picFleft, endOfFirst - 55, halfOfY - 25, widthF, heightF);
                  }
               }

               startX = XofFirst - 20;
               endX = XofFirst + widthOfFirst;
               startY = endY = Y;
               halfOfFirst = halfOfLast = heightOfFirst / 2 - Y / 2;
            }
         }
         else if (rodsRows > 1) {
            //Отрисовка стержня
            ctx.strokeRect(X, Y, width, currentHeight);

            //Если текущий стержень - первый
            if (i === 0) {
               halfOfFirst = currentHeight / 2;
            }

            //Если текущий стержень - последний
            if (i === rodsRows - 1) {
               halfOfLast = currentHeight / 2;
            }
            //Изменение координат для следующих стержней
            X += width;
            endX = X;
            Y = Y + currentHeight / 2 - (arrayA[i + 1] * coefA / 2);

            //Отрисовка погонной нагрузки
            if (arrayQ[i] !== 0) {
               //Координаты стрелки
               let xQ = x;
               let yQ = y - 10;

               //Ширина одной стрелки
               let widthQ = 0;
               if (width < 40) {
                  widthQ = width;
               }
               else {
                  widthQ = 40;
               }
               //Высота одной стрелки
               let heightQ = 20;

               //Для положительных погонных нагрузок
               if (arrayQ[i] > 0) {
                  do {
                     ctx.drawImage(picQright, xQ, yQ, widthQ, heightQ);
                     xQ += widthQ;
                  } while (xQ + widthQ <= X);
                  //Если осталось свободное место для неполной стрелки
                  if (xQ + widthQ >= X) {
                     widthQ = X - xQ;
                     ctx.drawImage(picQright, xQ, yQ, widthQ, heightQ);
                  }
               }
               //Для отрицательных погонных нагрузок
               else if (arrayQ[i] < 0) {
                  do {
                     ctx.drawImage(picQleft, xQ, yQ, widthQ, heightQ);
                     xQ += widthQ;
                  } while (xQ + widthQ <= X);
                  //Если осталось свободное место для неполной стрелки
                  if (xQ + widthQ >= X) {
                     widthQ = X - xQ;
                     ctx.drawImage(picQleft, xQ, yQ, widthQ, heightQ);
                  }
               }
            }

            //Сосредоточенные нагрузки:
            //Сосредоточенные нагрузки для первого стержня с учётом левой опоры
            if (i === 0) {
               if (document.getElementById('left').checked == false) {
                  if (arrayF[i] > 0 && arrayF[i]) {
                     ctx.drawImage(picFright, x, yF, widthF, heightF);
                  }
                  else if (arrayF[i] < 0 && arrayF[i]) {
                     ctx.drawImage(picFleft, x - 55, yF, widthF, heightF);
                  }
               }
            }

            if (i !== rodsRows - 1) {
               if ((arrayF[i + 1] > 0 && arrayF[i + 1])) {
                  ctx.drawImage(picFright, X, yF, widthF, heightF);
               }
               else if ((arrayF[i + 1] < 0 && arrayF[i + 1])) {
                  ctx.drawImage(picFleft, X - 55, yF, widthF, heightF);
               }
            }

            //Сосредоточенные нагрузки для последнего стержня с учётом правой опоры
            if (i === rodsRows - 1) {
               if (document.getElementById('right').checked == false) {
                  if (arrayF[rodsRows] > 0 && arrayF[rodsRows]) {
                     ctx.drawImage(picFright, X, yF, widthF, heightF);
                  }
                  else if (arrayF[rodsRows] < 0 && arrayF[rodsRows]) {
                     ctx.drawImage(picFleft, X - 55, yF, widthF, heightF);
                  }
               }
            }
         }
      }

      let leftSupport = document.getElementById('leftSupport');
      let rightSupport = document.getElementById('rightSupport');
      let yS = endY + halfOfLast - maxHeight / 2;
      let widthOfSupport = 20;
      if ((document.getElementById('left').checked == true) &&
         (document.getElementById('right').checked == false)) {
         ctx.drawImage(leftSupport, startX, startY + halfOfFirst - maxHeight / 2, widthOfSupport, maxHeight);
      } else if ((document.getElementById('right').checked == true)
         && (document.getElementById('left').checked == false)) {
         ctx.drawImage(rightSupport, endX, yS, widthOfSupport, maxHeight);
      } else if ((document.getElementById('left').checked == true)
         && (document.getElementById('right').checked == true)) {
         ctx.drawImage(leftSupport, startX, startY + halfOfFirst - maxHeight / 2, widthOfSupport, maxHeight);
         ctx.drawImage(rightSupport, endX, yS, widthOfSupport, maxHeight);
      }
   }
}

function save() {
   //Массив данных о стержне без номера (только введенные данные)
   let arrayR = [];
   let rodsRows = document.getElementById('RodsList').rows.length;
   let rodsCells = document.getElementById('RodsList').rows[0].cells.length - 1;

   for (let i = 0; i < rodsRows; i++) {
      arrayR[i] = [];
   }

   for (let i = 0; i < rodsRows; i++) {
      for (let j = 0; j < rodsCells; j++) {
         arrayR[i][j] = document.getElementById('RodsList').rows[i].cells[j + 1].firstChild.valueAsNumber;
      }
   }

   //Массив данных о сосредоточенных нагрузках (только введенные данные)
   let arrayF = fillArray(arraysOfColumns.arrayF, tables.listF, 1);

   //Массив данных о погонных нагрузках (только введенные данные)
   let arrayQ = fillArray(arraysOfColumns.arrayQ, tables.listQ, 1);

   /*Массив опор. Массив из двух элементов, которые принимают значения 0 и 1. 
   Если значение первого элемента 1, значит есть левая опора; 
   если значение второго элемента 1, значит есть правая опора; если 0 - опоры нет*/
   let arrayS = [];
   for (let i = 0; i < 2; i++) {
      if (document.getElementById('left').checked == true) {
         arrayS[0] = 1;
      }
      else {
         arrayS[0] = 0;
      }
      if (document.getElementById('right').checked == true) {
         arrayS[1] = 1;
      }
      else {
         arrayS[1] = 0;
      }
   }

   const result = prompt("Введите название файла");
   let resultR = result + "R";
   let resultF = result + "F";
   let resultQ = result + "Q";
   let resultS = result + "S";

   localStorage.setItem(resultR, JSON.stringify(arrayR));
   localStorage.setItem(resultF, JSON.stringify(arrayF));
   localStorage.setItem(resultQ, JSON.stringify(arrayQ));
   localStorage.setItem(resultS, JSON.stringify(arrayS));
}

function upload() {
   const data = prompt("Введите название файла");

   //Переменные для хранения данных каждого из массивов файла
   let dataRid = data + "R";
   let dataR = localStorage.getItem(dataRid);

   let dataFid = data + "F";
   let dataF = localStorage.getItem(dataFid);

   let dataQid = data + "Q";
   let dataQ = localStorage.getItem(dataQid);

   let dataSid = data + "S";
   let dataS = localStorage.getItem(dataSid);


   dataR = JSON.parse(dataR);
   dataF = JSON.parse(dataF);
   dataQ = JSON.parse(dataQ);
   dataS = JSON.parse(dataS);

   //Для характеристик и материалов самого стержня:
   //Добавляем строки, если количество строк из файла меньше текущего количества строк на странице
   if (tables.rodsList.rows.length < dataR.length) {
      for (let j = 0; j < dataR.length - 1; j++) {
         appendRow('RodsList', 'plus');
      }
   }
   //Удаляем строки, если количество строк из файла меньше текущего количества строк на странице
   else if (tables.rodsList.rows.length > dataR.length) {
      while (tables.rodsList.rows.length > dataR.length) {
         dltRow('RodsList');
      }
   }

   //Для сосредоточенных сил
   if (tables.listF.rows.length < dataF.length) {
      for (let j = 0; j < dataF.length - 1; j++) {
         appendRow('listF', 'plusAndMinus');
      }
   }
   else if (tables.listF.rows.length > dataF.length) {
      while (tables.listF.rows.length > dataF.length) {
         dltRow('listF');
      }
   }

   //Для сосредоточенных сил
   if (tables.listQ.rows.length < dataQ.length) {
      for (let j = 0; j < dataQ.length - 1; j++) {
         appendRow('listQ', 'plusAndMinus');
      }
   }
   else if (tables.listQ.rows.length > dataQ.length) {
      while (tables.listQ.rows.length > dataQ.length) {
         dltRow('listQ');
      }
   }

   //Заполнение всех таблиц данными из файла
   for (let i = 0; i < tables.rodsList.rows.length; i++) {
      for (let j = 0; j < tables.rodsList.rows[0].cells.length - 1; j++) {
         tables.rodsList.rows[i].cells[j + 1].firstChild.valueAsNumber = dataR[i][j];
      }
   }

   for (let i = 0; i < tables.listF.rows.length; i++) {
      tables.listF.rows[i].cells[1].firstChild.valueAsNumber = dataF[i];
   }

   for (let i = 0; i < tables.listQ.rows.length; i++) {
      tables.listQ.rows[i].cells[1].firstChild.valueAsNumber = dataQ[i];
   }

   //Заполнение данных об опорах
   if (dataS[0] == 0) {
      document.getElementById('left').checked = false;
   }
   else {
      document.getElementById('left').checked = true;
   }

   if (dataS[1] == 0) {
      document.getElementById('right').checked = false;
   }
   else {
      document.getElementById('right').checked = true;
   }
}

//Вычисления для процессора

//Определитель матрицы
function Determinant(A) {
   let N = A.length, B = [], denom = 1, exchanges = 0;
   for (let i = 0; i < N; ++i) {
      B[i] = [];
      for (let j = 0; j < N; ++j) B[i][j] = A[i][j];
   }
   for (let i = 0; i < N - 1; ++i) {
      let maxN = i, maxValue = Math.abs(B[i][i]);
      for (let j = i + 1; j < N; ++j) {
         let value = Math.abs(B[j][i]);
         if (value > maxValue) { maxN = j; maxValue = value; }
      }
      if (maxN > i) {
         let temp = B[i]; B[i] = B[maxN]; B[maxN] = temp;
         ++exchanges;
      }
      else { if (maxValue == 0) return maxValue; }
      let value1 = B[i][i];
      for (let j = i + 1; j < N; ++j) {
         let value2 = B[j][i];
         B[j][i] = 0;
         for (let k = i + 1; k < N; ++k) B[j][k] = (B[j][k] * value1 - B[i][k] * value2) / denom;
      }
      denom = value1;
   }
   if (exchanges % 2) return -B[N - 1][N - 1];
   else return B[N - 1][N - 1];
}

//Матрица алгебраических дополнений
function AdjugateMatrix(A) {
   let N = A.length, adjA = [];
   for (let i = 0; i < N; i++) {
      adjA[i] = [];
      for (let j = 0; j < N; j++) {
         let B = [], sign = ((i + j) % 2 == 0) ? 1 : -1;
         for (let m = 0; m < j; m++) {
            B[m] = [];
            for (let n = 0; n < i; n++)   B[m][n] = A[m][n];
            for (let n = i + 1; n < N; n++) B[m][n - 1] = A[m][n];
         }
         for (let m = j + 1; m < N; m++) {
            B[m - 1] = [];
            for (let n = 0; n < i; n++) {
               B[m - 1][n] = A[m][n];
            }
            for (let n = i + 1; n < N; n++) {
               B[m - 1][n - 1] = A[m][n];
            }
         }
         adjA[i][j] = sign * Determinant(B);
         if (adjA[i][j] == -0) {
            adjA[i][j] = 0;
         }
      }
   }
   return adjA;
}

//Обратная матрица
function InverseMatrix(A) {
   var det = Determinant(A);
   if (det == 0) return false;
   var N = A.length, A = AdjugateMatrix(A);
   for (let i = 0; i < N; i++) { for (let j = 0; j < N; j++) A[i][j] /= det; }
   return A;
}

//Транспонирование матрицы
function TransMatrix(A) {
   let m = A.length, n = A[0].length, AT = [];
   for (let i = 0; i < n; i++) {
      AT[i] = [];
      for (let j = 0; j < m; j++) AT[i][j] = A[j][i];
   }
   return AT;
}

//Умножение матрицы на столбец
function MultiplyMatrix(A, B) {
   let rowsA = A.length, colsA = A[0].length,
      rowsB = B.length, colsB = 1,
      C = [];
   if (colsA != rowsB) return false;
   for (let i = 0; i < rowsA; i++) C[i] = []; {
      for (let i = 0; i < rowsA; i++) {
         let t = 0;
         for (let j = 0; j < rowsB; j++) t += A[i][j] * B[j];
         C[i] = t;
      }
   }
   return C;
}

function processor() {
   //Количество строк в каждой таблице 
   let rodsRows = tables.rodsList.rows.length;
   let rowsF = tables.listF.rows.length;
   let rowsQ = tables.listQ.rows.length;

   //Массивы, содержащие введенные данные
   let arrayF = fillArray(arraysOfColumns.arrayF, tables.listF, 1);
   let arrayQ = fillArray(arraysOfColumns.arrayQ, tables.listQ, 1);
   let arrayL = fillArray(arraysOfColumns.arrayL, tables.rodsList, 1);
   let arrayA = fillArray(arraysOfColumns.arrayA, tables.rodsList, 2);
   let arrayE = fillArray(arraysOfColumns.arrayE, tables.rodsList, 3);

   //Корректирование табличных данных для математических операций

   //Для таблицы стержней
   for (let r = 0; r < rodsRows; r++) {
      if (isNaN(arrayL[r])) {
         arrayL[r] = 0;
      }
      if (isNaN(arrayA[r])) {
         arrayA[r] = 0;
      }
      if (isNaN(arrayE[r])) {
         arrayE[r] = 0;
      }
   }
   //Для таблицы сосредоточенных нагрузок
   for (let r = 0; r < rodsRows + 1; r++) {
      if (r >= rowsF) {
         arrayF[r] = 0;
      }
      if (isNaN(arrayF[r])) {
         arrayF[r] = 0;
      }
   }
   //Для таблицы погонных нагрузок
   for (let r = 0; r < rodsRows; r++) {
      if (r >= rowsQ) {
         arrayQ[r] = 0;
      }
      if (isNaN(arrayQ[r])) {
         arrayQ[r] = 0;
      }
   }

   //Если введена сосредоточенная нагрузка на первый узел и при этом задана левая опора, обнуляем нагрузку
   if (document.getElementById('left').checked == true) {
      arrayF[0] = 0;
   }
   //Если введена сосредоточенная нагрузка на последний узел и при этом задана правая опора, обнуляем нагрузку
   if (document.getElementById('right').checked == true) {
      arrayF[rodsRows] = 0;
   }

   //Математические операции (Решение СЛАУ)
   //Глобальный вектор реакций
   let b = [];
   for (let i = 0; i < rodsRows + 1; i++) {
      if (i == 0) {
         b[i] = arrayF[i] + arrayQ[i] * arrayL[i] / 2;
         b[i + 1] = arrayQ[i] * arrayL[i] / 2;
      }
      else if (i == rodsRows) {
         b[i] = arrayF[i];
         b[i] += arrayQ[i - 1] * arrayL[i - 1] / 2;
      }
      else {
         b[i] += arrayF[i] + arrayQ[i] * arrayL[i] / 2;;
         b[i + 1] = arrayQ[i] * arrayL[i] / 2;
      }
   }

   //Глобальная матрица реакций
   let A = [];
   for (let j = 0; j < rodsRows + 1; j++) {
      A[j] = [];
   }

   for (let i = 0; i < rodsRows + 1; i++) {
      for (let j = 0; j < rodsRows + 1; j++) {
         A[i][j] = 0;
      }
   }

   for (let i = 0; i < rodsRows + 1; i++) {
      let K = (arrayE[i] * arrayA[i]) / arrayL[i];

      if (i == rodsRows) {
         A[rodsRows][rodsRows] = (arrayE[rodsRows - 1] * arrayA[rodsRows - 1]) / arrayL[rodsRows - 1];
      }
      else {
         A[i][i] += K;
         A[i + 1][i + 1] += K;
         A[i + 1][i] -= K;
         A[i][i + 1] -= K;
      }
   }

   //С учётом кинематических условий
   if (document.getElementById('left').checked == true) {
      A[0][0] = 1;
      A[0][1] = 0;
      A[1][0] = 0;
      b[0] = 0;
   }
   if (document.getElementById('right').checked == true) {
      A[rodsRows][rodsRows] = 1;
      A[rodsRows][rodsRows - 1] = 0;
      A[rodsRows - 1][rodsRows] = 0;
      b[rodsRows] = 0;
   }

   let newA = InverseMatrix(A);
   let delta = MultiplyMatrix(newA, b);

   function N(i, x, delta) {
      return (arrayE[i] * arrayA[i] / arrayL[i] * (delta[i + 1] - delta[i]) + arrayQ[i]
         * arrayL[i] / 2 * (1 - 2 * x / arrayL[i]));
   }

   function u(i, x, delta) {
      return (delta[i] + (x / arrayL[i]) * (delta[i + 1] - delta[i]) + (arrayQ[i] * arrayL[i]
         * arrayL[i] * x * (1 - x / arrayL[i]) / (2 * arrayE[i] * arrayA[i] * arrayL[i])));
   }

   function xExtr(i, delta) {
      return (((delta[i + 1] - delta[i]) / arrayL[i] + (arrayQ[i] * arrayL[i]) /
         (2 * arrayE[i] * arrayA[i])) * (arrayE[i] * arrayA[i]) / arrayQ[i]);
   }

   function sigma(i, x, delta) {
      i = i;
      x = x;
      delta = delta;
      return (N(i, x, delta) / arrayA[i]);
   }

   //Массивы для хранения усилий в стержнях, N0 - усилия в начале стержня, NL - усилия в конце стержня
   let N0 = [];
   let NL = [];
   for (let i = 0; i < rodsRows; i++) {
      N0[i] = N(i, 0, delta);
      NL[i] = N(i, arrayL[i], delta);
   }

   /*Массивы для хранения перемещений в стержнях, u0 - перемещения в начале стержня, 
   uL - перемещения в конце стержня, uExtr - экстремумы*/
   let u0 = [];
   let uL = [];
   let xExt = [];
   let uExtr = [];
   for (let i = 0; i < rodsRows; i++) {
      u0[i] = u(i, 0, delta);
      uL[i] = u(i, arrayL[i], delta);
      if (arrayQ[i] == 0) {
         xExt[i] = 0;
         uExtr[i] = 0;
      }
      else {
         xExt[i] = xExtr(i, delta);
         uExtr[i] = u(i, xExt[i], delta);
      }
   }

   /*Массивы с напряжениями в стержнях, sigma0 - напряжения в начале стержня, 
   sigmaL - напряжения в конце стержня*/
   let sigma0 = [];
   let sigmaL = [];
   for (let i = 0; i < rodsRows; i++) {
      sigma0[i] = sigma(i, 0, delta);
      sigmaL[i] = sigma(i, arrayL[i], delta);
   }

   //Сохранение работы процессора
   const result = prompt("Введите название, под которым хотите сохранить работу процессора: ");
   let resultDelta = result + "delta";
   let resultN0 = result + "N0";
   let resultNL = result + "NL";
   let resultU0 = result + "U0";
   let resultUL = result + "UL";
   let resultUextr = result + "Uextr";
   let resultXEextr = result + "XEextr";
   let resultSigma0 = result + "Sigma0";
   let resultSigmaL = result + "SigmaL";

   localStorage.setItem(resultDelta, JSON.stringify(delta));
   localStorage.setItem(resultN0, JSON.stringify(N0));
   localStorage.setItem(resultNL, JSON.stringify(NL));
   localStorage.setItem(resultU0, JSON.stringify(u0));
   localStorage.setItem(resultUL, JSON.stringify(uL));
   localStorage.setItem(resultUextr, JSON.stringify(uExtr));
   localStorage.setItem(resultXEextr, JSON.stringify(xExt));
   localStorage.setItem(resultSigma0, JSON.stringify(sigma0));
   localStorage.setItem(resultSigmaL, JSON.stringify(sigmaL));

   console.log("delta: " + delta);
   console.log("N0: " + N0);
   console.log("NL: " + NL);
   console.log("u0: " + u0);
   console.log("uL: " + uL);
   console.log("uExtr: " + uExtr);
   console.log("xExt: " + xExt);
   console.log("sigma0: " + sigma0);
   console.log("sigmaL: " + sigmaL);

   //Работа постпроцессора

   //Получение холста
   let canvas = document.getElementById('canv2');

   if (canvas.getContext) {
      let ctx2 = canvas.getContext('2d');
      ctx2.clearRect(0, 0, canvas.width, canvas.height);

      //Сетка
      const gridWidth = canvas.width;
      const gridHeight = canvas.height;
      //Начальная координата x
      let x = 50;
      let y = 50;
      ctx2.beginPath();

      for (let i = 0; i <= gridWidth; i += x) {
         ctx2.moveTo(i, 0);
         ctx2.lineTo(i, gridHeight);
      }
      ctx2.stroke();

      for (let j = 0; j <= gridHeight; j += y) {
         ctx2.moveTo(0, j);
         ctx2.lineTo(gridWidth, j);
      }
      ctx2.stroke();
      ctx2.closePath();

      ctx2.beginPath();
      ctx2.font = "24px Verdana";
      ctx2.strokeStyle = "lightblue";
      ctx2.strokeText("0", 20, 240);

      //Общая длина всех стержней
      let totalLengthL = 0;
      for (let i = 0; i < rodsRows; i++) {
         totalLengthL += arrayL[i];
      }
      //Общие усилия всех стержней
      let totalEffort = 0;
      for (let i = 0; i < rodsRows; i++) {
         totalEffort += Math.abs(N0[i]);
         totalEffort += Math.abs(NL[i]);
      }

      //Коэффициенты для пропорционального распределения длины и усилений между стержнями
      var coefL = 0;
      var coefN = 0;
      coefL = (canvas.width - 100) / totalLengthL;
      coefN = 2 * (canvas.height - 200) / totalEffort;

      ctx2.moveTo(0, 250);
      ctx2.lineTo(canvas.width, 250);
      ctx2.strokeStyle = 'black';
      ctx2.stroke();

      ctx2.font = "16px Verdana";
      ctx2.fillStyle = 'lightblue';

      for (let i = 0; i < rodsRows; i++) {
         if (N0[i] > 0) {
            ctx2.moveTo(x, 250);
            ctx2.lineTo(x, 0);
            ctx2.strokeStyle = 'lightblue';
            ctx2.stroke();
            if (N0[i] * coefN > 250) {
               ctx2.fillText(String(N0[i].toFixed(2)) + 'qL', x, 0);
               ctx2.moveTo(x, 0);
            }
            else {
               ctx2.fillText(String(N0[i].toFixed(2)) + 'qL', x, 250 - N0[i] * coefN);
               ctx2.moveTo(x, 250 - N0[i] * coefN);
            }
         }
         else if (N0[i] < 0) {
            ctx2.moveTo(x, 250 - N0[i] * coefN);
            ctx2.lineTo(x, 0);
            ctx2.strokeStyle = 'lightblue';
            ctx2.stroke();
            if (Math.abs(N0[i]) * coefN > 250) {
               ctx2.fillText(String(N0[i].toFixed(2)) + 'qL', x, 500);
               ctx2.moveTo(x, 500);
            }
            else {
               ctx2.fillText(String(N0[i].toFixed(2)) + 'qL', x, 250 + Math.abs(N0[i]) * coefN);
               ctx2.moveTo(x, 250 + Math.abs(N0[i]) * coefN);
            }
         }
         else if (N0[i] == 0) {
            ctx2.moveTo(x, 250 - N0[i] * coefN);
            ctx2.lineTo(x, 0);
            ctx2.strokeStyle = 'lightblue';
            ctx2.stroke();
            ctx2.fillText(String(N0[i].toFixed(2)) + 'qL', x, 250 + N0[i] * coefN);
            ctx2.moveTo(x, 250 + N0[i] * coefN);
         }
         if (NL[i] > 0) {
            if (NL[i] * coefN > 250) {
               ctx2.fillText(String(NL[i].toFixed(2)) + 'qL', x + arrayL[i] * coefL, 0);
               ctx2.lineTo(x + arrayL[i] * coefL, 0);
            }
            else {
               ctx2.fillText(String(NL[i].toFixed(2)) + 'qL', x + arrayL[i] * coefL, 250 - Math.abs(NL[i]) * coefN);
               ctx2.lineTo(x + arrayL[i] * coefL, 250 - Math.abs(NL[i]) * coefN);
            }
            ctx2.strokeStyle = 'lightblue';
            ctx2.stroke();
            ctx2.moveTo(x + arrayL[i] * coefL, 0);
            ctx2.lineTo(x + arrayL[i] * coefL, 250);
            ctx2.strokeStyle = 'lightblue';
            ctx2.stroke();
         }
         else if (NL[i] <= 0) {
            if (Math.abs(NL[i]) * coefN > 250) {
               ctx2.fillText(String(NL[i].toFixed(2)) + 'qL', x + arrayL[i] * coefL, 500);
               ctx2.lineTo(x + arrayL[i] * coefL, 500);
            }
            else {
               ctx2.fillText(String(NL[i].toFixed(2)) + 'qL', x + arrayL[i] * coefL, 250 + Math.abs(NL[i]) * coefN);
               ctx2.lineTo(x + arrayL[i] * coefL, 250 + Math.abs(NL[i]) * coefN);
            }
            ctx2.strokeStyle = 'lightblue';
            ctx2.stroke();
            ctx2.moveTo(x + arrayL[i] * coefL, 0);
            ctx2.lineTo(x + arrayL[i] * coefL, 250 + Math.abs(NL[i]) * coefN);
            ctx2.strokeStyle = 'lightblue';
            ctx2.stroke();
         }
         x += arrayL[i] * coefL;
      }

      ctx2.moveTo(x + arrayL[rodsRows - 1] * coefL, 250);
      ctx2.lineTo(x + arrayL[rodsRows - 1] * coefL, 0);
      ctx2.stroke();

   }

   //Получение следующего холста
   let canvasS = document.getElementById('canv3');

   if (canvasS.getContext) {
      let ctx3 = canvasS.getContext('2d');
      ctx3.clearRect(0, 0, canvasS.width, canvasS.height);

      //Сетка
      const gridWidth = canvas.width;
      const gridHeight = canvas.height;

      //Начальные координаты
      let x = 50;
      let y = 50;
      ctx3.beginPath();

      for (let i = 0; i <= gridWidth; i += x) {
         ctx3.moveTo(i, 0);
         ctx3.lineTo(i, gridHeight);
      }
      ctx3.stroke();

      for (let j = 0; j <= gridHeight; j += y) {
         ctx3.moveTo(0, j);
         ctx3.lineTo(gridWidth, j);
      }
      ctx3.stroke();
      ctx3.closePath();

      ctx3.beginPath();
      ctx3.font = "24px Verdana";
      ctx3.strokeStyle = "lightcoral";
      ctx3.strokeText("0", 20, 240);

      ctx3.font = "16px Verdana";
      ctx3.fillStyle = 'lightcoral';

      //Общие напряжения всех стержней
      let totalSigma = 0;
      for (let i = 0; i < rodsRows; i++) {
         totalSigma += Math.abs(sigma0[i]);
         totalSigma += Math.abs(sigmaL[i]);
      }

      //Коэффициент для пропорционального распределения напряжений
      let coefSigma = 0;
      coefSigma = 2 * (canvasS.height - 200) / totalSigma;

      ctx3.moveTo(0, 250);
      ctx3.lineTo(canvasS.width, 250);
      ctx3.stroke();

      for (let i = 0; i < rodsRows; i++) {
         if (sigma0[i] > 0) {
            ctx3.moveTo(x, 250);
            ctx3.lineTo(x, 0);
            ctx3.strokeStyle = 'lightcoral';
            ctx3.stroke();
            if (sigma0[i] * coefSigma > 250) {
               ctx3.fillText(String(sigma0[i].toFixed(2)) + 'qL/A', x, 0);
               ctx3.moveTo(x, 0);
            }
            else {
               ctx3.fillText(String(sigma0[i].toFixed(2)) + 'qL/A', x, 250 - sigma0[i] * coefSigma);
               ctx3.moveTo(x, 250 - sigma0[i] * coefSigma);
            }
         }
         else if (sigma0[i] < 0) {
            ctx3.moveTo(x, 250 - sigma0[i] * coefSigma);
            ctx3.lineTo(x, 0);
            ctx3.strokeStyle = 'lightcoral';
            ctx3.stroke();
            if (Math.abs(sigma0[i]) * coefSigma > 250) {
               ctx3.fillText(String(sigma0[i].toFixed(2)) + 'qL/A', x, 500);
               ctx3.moveTo(x, 500);
            }
            else {
               ctx3.fillText(String(sigma0[i].toFixed(2)) + 'qL/A', x, 250 + Math.abs(sigma0[i]) * coefSigma);
               ctx3.moveTo(x, 250 + Math.abs(sigma0[i]) * coefSigma);
            }
         }
         else if (sigma0[i] == 0) {
            ctx3.moveTo(x, 250 - sigma0[i] * coefSigma);
            ctx3.lineTo(x, 0);
            ctx3.strokeStyle = 'lightcoral';
            ctx3.stroke();
            ctx3.moveTo(x, 250 + sigma0[i] * coefSigma);
         }
         if (sigmaL[i] > 0) {
            if (sigmaL[i] * coefSigma > 250) {
               ctx3.fillText(String(sigmaL[i].toFixed(2)) + 'qL/A', x + arrayL[i] * coefL, 0);
               ctx3.lineTo(x + arrayL[i] * coefL, 0);
            }
            else {
               ctx3.fillText(String(sigmaL[i].toFixed(2)) + 'qL/A', x + arrayL[i] * coefL, 250 - Math.abs(sigmaL[i]) * coefSigma);
               ctx3.lineTo(x + arrayL[i] * coefL, 250 - Math.abs(sigmaL[i]) * coefSigma);
            }
            ctx3.strokeStyle = 'lightcoral';
            ctx3.stroke();
            ctx3.moveTo(x + arrayL[i] * coefL, 0);
            ctx3.lineTo(x + arrayL[i] * coefL, 250);
            ctx3.strokeStyle = 'lightcoral';
            ctx3.stroke();
         }
         else if (sigmaL[i] <= 0) {
            if (Math.abs(sigmaL[i]) * coefSigma > 250) {
               ctx3.fillText(String(sigmaL[i].toFixed(2)) + 'qL/A', x + arrayL[i] * coefL, 500);
               ctx3.lineTo(x + arrayL[i] * coefL, 500);
            }
            else {
               ctx3.fillText(String(sigmaL[i].toFixed(2)) + 'qL/A', x + arrayL[i] * coefL, 250 + Math.abs(sigmaL[i]) * coefSigma);
               ctx3.lineTo(x + arrayL[i] * coefL, 250 + Math.abs(sigmaL[i]) * coefSigma);
            }
            ctx3.strokeStyle = 'lightcoral';
            ctx3.stroke();
            ctx3.moveTo(x + arrayL[i] * coefL, 0);
            ctx3.lineTo(x + arrayL[i] * coefL, 250 + Math.abs(sigmaL[i]) * coefSigma);
            ctx3.strokeStyle = 'lightcoral';
            ctx3.stroke();
         }
         x += arrayL[i] * coefL;
      }

      ctx3.moveTo(x + arrayL[rodsRows - 1] * coefL, 250);
      ctx3.lineTo(x + arrayL[rodsRows - 1] * coefL, 0);
      ctx3.stroke();

   }

   //Получение следующего холста
   let canvasU = document.getElementById('canv4');

   if (canvasU.getContext) {
      let ctx4 = canvasU.getContext('2d');
      ctx4.clearRect(0, 0, canvasU.width, canvasU.height);

      //координаты стержня
      let x = 50;
      let y = 50;

      //Сетка
      const gridWidth = canvas.width;
      const gridHeight = canvas.height;

      ctx4.beginPath();

      for (let i = 0; i <= gridWidth; i += x) {
         ctx4.moveTo(i, 0);
         ctx4.lineTo(i, gridHeight);
      }
      ctx4.stroke();

      for (let j = 0; j <= gridHeight; j += y) {
         ctx4.moveTo(0, j);
         ctx4.lineTo(gridWidth, j);
      }
      ctx4.stroke();
      ctx4.closePath();

      ctx4.beginPath();

      //Общие перемещения всех стержней
      let totalU = 0;
      for (let i = 0; i < rodsRows; i++) {
         totalU += Math.abs(u0[i]);
         totalU += Math.abs(uL[i]);
         totalU += Math.abs(uExtr[i]);
      }

      //Координаты для начала 
      let beginX = 0;
      let beginY = 0;

      //Коэффициент для пропорционального распределения перемещений 
      let coefU = 0;
      coefU = (canvasU.height - 200) / totalU;

      ctx4.moveTo(0, 250);
      ctx4.lineTo(canvasS.width, 250);
      ctx4.stroke();

      ctx4.font = "16px Verdana";
      ctx4.fillStyle = 'lightgreen';

      for (let i = 0; i < rodsRows; i++) {
         if (xExt[i] !== 0) {
            if (u0[i] >= 0) {
               ctx4.moveTo(x, 250);
               ctx4.lineTo(x, 0);
               ctx4.strokeStyle = 'lightgreen';
               ctx4.stroke();
               if (u0[i] * coefU > 250) {
                  beginX = x;
                  beginY = 0;
               }
               else {
                  beginX = x;
                  beginY = 250 - u0[i] * coefU;
               }

               if (uExtr[i] >= 0 && uL[i] > 0) {
                  ctx4.fillText(String(u0[i].toFixed(2)), beginX, beginY + 10);
                  ctx4.fillText(String(uExtr[i].toFixed(2)), x + xExt[i] * coefL, 250 - uExtr[i] * coefU + 10);
                  ctx4.fillText(String(uL[i].toFixed(2)), x + arrayL[i] * coefL, 250 - uL[i] * coefU + 10);
                  let myPoints = [beginX, beginY, x + xExt[i] * coefL, 250 - uExtr[i] * coefU, x + arrayL[i] * coefL, 250 - uL[i] * coefU];
                  if (myPoints[2] < myPoints[0]) {
                     myPoints[2] = myPoints[0];
                     myPoints[3] = myPoints[1];
                  }
                  if (myPoints[2] > myPoints[4]) {
                     myPoints[2] = myPoints[4];
                     myPoints[3] = myPoints[5];
                  }
                  drawCurve(ctx4, myPoints);
                  ctx4.strokeStyle = 'lightgreen';
                  ctx4.stroke();
               }

               if (uExtr[i] >= 0 && uL[i] < 0) {
                  ctx4.fillText(String(u0[i].toFixed(2)), beginX, beginY + 10);
                  ctx4.fillText(String(uExtr[i].toFixed(2)), x + xExt[i] * coefL, 250 - uExtr[i] * coefU + 10);
                  ctx4.fillText(String(uL[i].toFixed(2)), x + arrayL[i] * coefL, 250 + Math.abs(uL[i]) * coefU + 10);
                  let myPoints = [beginX, beginY, x + xExt[i] * coefL, 250 - uExtr[i] * coefU, x + arrayL[i] * coefL, 250 + Math.abs(uL[i]) * coefU];

                  if (myPoints[2] < myPoints[0]) {
                     myPoints[2] = myPoints[0];
                     myPoints[3] = myPoints[1];
                  }
                  if (myPoints[2] > myPoints[4]) {
                     myPoints[2] = myPoints[4];
                     myPoints[3] = myPoints[5];
                  }
                  drawCurve(ctx4, myPoints);
                  ctx4.strokeStyle = 'lightgreen';
                  ctx4.stroke();
               }

               if (uExtr[i] >= 0 && uL[i] == 0) {
                  ctx4.fillText(String(u0[i].toFixed(2)), beginX, beginY + 10);
                  ctx4.fillText(String(uExtr[i].toFixed(2)), x + xExt[i] * coefL, 250 - uExtr[i] * coefU + 10);
                  ctx4.fillText(String(uL[i].toFixed(2)), x + arrayL[i] * coefL, 250 + Math.abs(uL[i]) * coefU + 10);
                  let myPoints = [beginX, beginY, x + xExt[i] * coefL, 250 - uExtr[i] * coefU, x + arrayL[i] * coefL, 250 + Math.abs(uL[i]) * coefU];
                  if (myPoints[2] < myPoints[0]) {
                     myPoints[2] = myPoints[0];
                     myPoints[3] = myPoints[1];
                  }
                  if (myPoints[2] > myPoints[4]) {
                     myPoints[2] = myPoints[4];
                     myPoints[3] = myPoints[5];
                  }
                  drawCurve(ctx4, myPoints);
                  ctx4.strokeStyle = 'lightgreen';
                  ctx4.stroke();
               }

               if (uExtr[i] <= 0 && uL[i] > 0) {
                  ctx4.fillText(String(u0[i].toFixed(2)), beginX, beginY + 10);
                  ctx4.fillText(String(uExtr[i].toFixed(2)), x + Math.abs(xExt[i]) * coefL, 250 - uExtr[i] * coefU + 10);
                  ctx4.fillText(String(uL[i].toFixed(2)), x + arrayL[i] * coefL, 250 - uL[i] * coefU + 10);
                  let myPoints = [beginX, beginY, x + Math.abs(xExt[i]) * coefL, 250 - uExtr[i] * coefU, x + arrayL[i] * coefL, 250 - uL[i] * coefU];

                  if (myPoints[2] < myPoints[0]) {
                     myPoints[2] = myPoints[0];
                     myPoints[3] = myPoints[1];
                  }
                  if (myPoints[2] > myPoints[4]) {
                     myPoints[2] = myPoints[4];
                     myPoints[3] = myPoints[5];
                  }
                  drawCurve(ctx4, myPoints);
                  ctx4.strokeStyle = 'lightgreen';
                  ctx4.stroke();
               }

               if (uExtr[i] <= 0 && uL[i] < 0) {
                  ctx4.fillText(String(u0[i].toFixed(2)), beginX, beginY + 10);
                  ctx4.fillText(String(uExtr[i].toFixed(2)), x + Math.abs(xExt[i]) * coefL, 250 - uExtr[i] * coefU + 10);
                  ctx4.fillText(String(uL[i].toFixed(2)), x + arrayL[i] * coefL, 250 - Math.abs(uL[i]) * coefU + 10);
                  let myPoints = [beginX, beginY, x + Math.abs(xExt[i]) * coefL, 250 - uExtr[i] * coefU, x + arrayL[i] * coefL, 250 - Math.abs(uL[i]) * coefU];

                  if (myPoints[2] < myPoints[0]) {
                     myPoints[2] = myPoints[0];
                     myPoints[3] = myPoints[1];
                  }
                  if (myPoints[2] > myPoints[4]) {
                     myPoints[2] = myPoints[4];
                     myPoints[3] = myPoints[5];
                  }
                  drawCurve(ctx4, myPoints);
                  ctx4.strokeStyle = 'lightgreen';
                  ctx4.stroke();
               }

               if (uExtr[i] <= 0 && uL[i] == 0) {
                  ctx4.fillText(String(u0[i].toFixed(2)), beginX, beginY + 10);
                  ctx4.fillText(String(uExtr[i].toFixed(2)), x + Math.abs(xExt[i]) * coefL, 250 - uExtr[i] * coefU + 10);
                  ctx4.fillText(String(uL[i].toFixed(2)), x + arrayL[i] * coefL, 250 - Math.abs(uL[i]) * coefU + 10);
                  let myPoints = [beginX, beginY, x + Math.abs(xExt[i]) * coefL, 250 - uExtr[i] * coefU, x + arrayL[i] * coefL, 250 - Math.abs(uL[i]) * coefU];

                  if (myPoints[2] < myPoints[0]) {
                     myPoints[2] = myPoints[0];
                     myPoints[3] = myPoints[1];
                  }
                  if (myPoints[2] > myPoints[4]) {
                     myPoints[2] = myPoints[4];
                     myPoints[3] = myPoints[5];
                  }
                  drawCurve(ctx4, myPoints);
                  ctx4.strokeStyle = 'lightgreen';
                  ctx4.stroke();
               }
            }

            else if (u0[i] < 0) {
               ctx4.moveTo(x, 250 - u0[i] * coefU);
               ctx4.lineTo(x, 0);
               ctx4.strokeStyle = 'lightgreen';
               ctx4.stroke();
               if (u0[i] * coefU > 250) {
                  beginX = x;
                  beginY = 500;
               }
               else {
                  beginX = x;
                  beginY = 250 - u0[i] * coefU;
               }

               if (uExtr[i] >= 0 && uL[i] > 0) {
                  if (uExtr[i] == uL[i]) {
                     ctx4.fillText(String(u0[i].toFixed(2)), beginX, beginY + 10);
                     ctx4.fillText(String(uL[i].toFixed(2)), x + arrayL[i] * coefL, 250 - uL[i] * coefU + 10);
                     ctx4.moveTo(beginX, beginY);
                     ctx4.lineTo(x + arrayL[i] * coefL, 250 - uL[i] * coefU);
                     ctx4.strokeStyle = 'lightgreen';
                     ctx4.stroke();
                  }
                  else {
                     ctx4.fillText(String(u0[i].toFixed(2)), beginX, beginY + 10);
                     ctx4.fillText(String(uExtr[i].toFixed(2)), x + xExt[i] * coefL, 250 - uExtr[i] * coefU + 10);
                     ctx4.fillText(String(uL[i].toFixed(2)), x + arrayL[i] * coefL, 250 - uL[i] * coefU + 10);
                     let myPoints = [beginX, beginY, x + xExt[i] * coefL, 250 - uExtr[i] * coefU, x + arrayL[i] * coefL, 250 - uL[i] * coefU];
                     if (myPoints[2] < myPoints[0]) {
                        myPoints[2] = myPoints[0];
                        myPoints[3] = myPoints[1];
                     }
                     if (myPoints[2] > myPoints[4]) {
                        myPoints[2] = myPoints[4];
                        myPoints[3] = myPoints[5];
                     }
                     drawCurve(ctx4, myPoints);
                     ctx4.strokeStyle = 'lightgreen';
                     ctx4.stroke();
                  }
               }

               if (uExtr[i] >= 0 && uL[i] == 0) {
                  if (uExtr[i] == uL[i]) {
                     ctx4.fillText(String(u0[i].toFixed(2)), beginX, beginY + 10);
                     ctx4.fillText(String(uL[i].toFixed(2)), x + arrayL[i] * coefL, 250 - uL[i] * coefU + 10);
                     ctx4.moveTo(beginX, beginY);
                     ctx4.lineTo(x + arrayL[i] * coefL, 250 - uL[i] * coefU);
                     ctx4.strokeStyle = 'lightgreen';
                     ctx4.stroke();
                  }
                  else {
                     ctx4.fillText(String(u0[i].toFixed(2)), beginX, beginY + 10);
                     ctx4.fillText(String(uExtr[i].toFixed(2)), x + xExt[i] * coefL, 250 - uExtr[i] * coefU + 10);
                     ctx4.fillText(String(uL[i].toFixed(2)), x + arrayL[i] * coefL, 250 - uL[i] * coefU + 10);
                     let myPoints = [beginX, beginY, x + xExt[i] * coefL, 250 - uExtr[i] * coefU, x + arrayL[i] * coefL, 250 - uL[i] * coefU];

                     if (myPoints[2] < myPoints[0]) {
                        myPoints[2] = myPoints[0];
                        myPoints[3] = myPoints[1];
                     }
                     if (myPoints[2] > myPoints[4]) {
                        myPoints[2] = myPoints[4];
                        myPoints[3] = myPoints[5];
                     }
                     drawCurve(ctx4, myPoints);
                     ctx4.strokeStyle = 'lightgreen';
                     ctx4.stroke();
                  }
               }

               if (uExtr[i] >= 0 && uL[i] < 0) {
                  ctx4.fillText(String(u0[i].toFixed(2)), beginX, beginY + 10);
                  ctx4.fillText(String(uExtr[i].toFixed(2)), x + xExt[i] * coefL, 250 - uExtr[i] * coefU + 10);
                  ctx4.fillText(String(uL[i].toFixed(2)), x + arrayL[i] * coefL, 250 + Math.abs(uL[i]) * coefU + 10);
                  let myPoints = [beginX, beginY, x + xExt[i] * coefL, 250 - uExtr[i] * coefU, x + arrayL[i] * coefL, 250 + Math.abs(uL[i]) * coefU];

                  if (myPoints[2] < myPoints[0]) {
                     myPoints[2] = myPoints[0];
                     myPoints[3] = myPoints[1];
                  }
                  if (myPoints[2] > myPoints[4]) {
                     myPoints[2] = myPoints[4];
                     myPoints[3] = myPoints[5];
                  }
                  drawCurve(ctx4, myPoints);
                  ctx4.strokeStyle = 'lightgreen';
                  ctx4.stroke();
               }

               if (uExtr[i] <= 0 && uL[i] > 0) {
                  ctx4.fillText(String(u0[i].toFixed(2)), beginX, beginY + 10);
                  ctx4.fillText(String(uExtr[i].toFixed(2)), x + xExt[i] * coefL, 250 - Math.abs(uExtr[i]) * coefU + 10);
                  ctx4.fillText(String(uL[i].toFixed(2)), x + arrayL[i] * coefL, 250 + uL[i] * coefU + 10);
                  let myPoints = [beginX, beginY, x + xExt[i] * coefL, 250 - Math.abs(uExtr[i]) * coefU, x + arrayL[i] * coefL, 250 + uL[i] * coefU];
                  if (myPoints[2] < myPoints[0]) {
                     myPoints[2] = myPoints[0];
                     myPoints[3] = myPoints[1];
                  }
                  if (myPoints[2] > myPoints[4]) {
                     myPoints[2] = myPoints[4];
                     myPoints[3] = myPoints[5];
                  }
                  drawCurve(ctx4, myPoints);
                  ctx4.strokeStyle = 'lightgreen';
                  ctx4.stroke();
               }

               if (uExtr[i] <= 0 && uL[i] == 0) {
                  if (uExtr[i] == uL[i]) {
                     ctx4.fillText(String(u0[i].toFixed(2)), beginX, beginY + 10);
                     ctx4.fillText(String(uL[i].toFixed(2)), x + arrayL[i] * coefL, 250 + uL[i] * coefU + 10);
                     ctx4.moveTo(beginX, beginY);
                     ctx4.lineTo(x + arrayL[i] * coefL, 250 + uL[i] * coefU);
                     ctx4.strokeStyle = 'lightgreen';
                     ctx4.stroke();
                  }
                  else {
                     ctx4.fillText(String(u0[i].toFixed(2)), beginX, beginY + 10);
                     ctx4.fillText(String(uExtr[i].toFixed(2)), x + xExt[i] * coefL, 250 - Math.abs(uExtr[i]) * coefU + 10);
                     ctx4.fillText(String(uL[i].toFixed(2)), x + arrayL[i] * coefL, 250 + uL[i] * coefU + 10);
                     let myPoints = [beginX, beginY, x + xExt[i] * coefL, 250 - Math.abs(uExtr[i]) * coefU, x + arrayL[i] * coefL, 250 + uL[i] * coefU];
                     if (myPoints[2] < myPoints[0]) {
                        myPoints[2] = myPoints[0];
                        myPoints[3] = myPoints[1];
                     }
                     if (myPoints[2] > myPoints[4]) {
                        myPoints[2] = myPoints[4];
                        myPoints[3] = myPoints[5];
                     }
                     drawCurve(ctx4, myPoints);
                     ctx4.strokeStyle = 'lightgreen';
                     ctx4.stroke();
                  }
               }

               if (uExtr[i] <= 0 && uL[i] < 0) {
                  if (uExtr[i] == uL[i]) {
                     ctx4.fillText(String(u0[i].toFixed(2)), beginX, beginY + 10);
                     ctx4.fillText(String(uL[i].toFixed(2)), x + arrayL[i] * coefL, 250 - uL[i] * coefU + 10);
                     ctx4.moveTo(beginX, beginY);
                     ctx4.lineTo(x + arrayL[i] * coefL, 250 - uL[i] * coefU);
                     ctx4.strokeStyle = 'lightgreen';
                     ctx4.stroke();
                  }
                  else {
                     ctx4.fillText(String(u0[i].toFixed(2)), beginX, beginY + 10);
                     ctx4.fillText(String(uExtr[i].toFixed(2)), x + xExt[i] * coefL, 250 - uExtr[i] * coefU + 10);
                     ctx4.fillText(String(uL[i].toFixed(2)), x + arrayL[i] * coefL, 250 - uL[i] * coefU + 10);
                     let myPoints = [beginX, beginY, x + xExt[i] * coefL, 250 - uExtr[i] * coefU, x + arrayL[i] * coefL, 250 - uL[i] * coefU];
                     if (myPoints[2] < myPoints[0]) {
                        myPoints[2] = myPoints[0];
                        myPoints[3] = myPoints[1];
                     }
                     if (myPoints[2] > myPoints[4]) {
                        myPoints[2] = myPoints[4];
                        myPoints[3] = myPoints[5];
                     }
                     drawCurve(ctx4, myPoints);
                     ctx4.strokeStyle = 'lightgreen';
                     ctx4.stroke();
                  }
               }
            }
         }
         else {
            if (u0[i] > 0) {
               ctx4.moveTo(x, 250);
               ctx4.lineTo(x, 0);
               ctx4.strokeStyle = 'lightgreen';
               ctx4.stroke();
               if (u0[i] * coefU > 250) {
                  ctx4.fillText(String(u0[i].toFixed(2)), x, 0 + 10);
                  ctx4.moveTo(x, 0);
               }
               else {
                  ctx4.fillText(String(u0[i].toFixed(2)), x, 250 - u0[i] * coefU + 10);
                  ctx4.moveTo(x, 250 - u0[i] * coefU);
               }
            }

            if (u0[i] <= 0) {
               ctx4.moveTo(x, 250 - u0[i] * coefU);
               ctx4.lineTo(x, 0);
               ctx4.strokeStyle = 'lightgreen';
               ctx4.stroke();
               if (Math.abs(u0[i]) * coefU > 250) {
                  ctx4.fillText(String(u0[i].toFixed(2)), x, 500 - 10);
                  ctx4.moveTo(x, 500);
               }
               else {
                  ctx4.fillText(String(u0[i].toFixed(2)), x, 250 + Math.abs(u0[i]) * coefU + 10);
                  ctx4.moveTo(x, 250 + Math.abs(u0[i]) * coefU);
               }
            }
            if (uL[i] > 0) {
               if (uL[i] * coefU > 250) {
                  ctx4.fillText(String(uL[i].toFixed(2)), x + arrayL[i] * coefL, 0 + 10);
                  ctx4.lineTo(x + arrayL[i] * coefL, 0);
               }
               else {
                  ctx4.fillText(String(uL[i].toFixed(2)), x + arrayL[i] * coefL, 250 - Math.abs(uL[i]) * coefU + 10);
                  ctx4.lineTo(x + arrayL[i] * coefL, 250 - Math.abs(uL[i]) * coefU);
               }
               ctx4.strokeStyle = 'lightgreen';
               ctx4.stroke();
            }

            if (uL[i] <= 0) {
               if (Math.abs(uL[i]) * coefU > 250) {
                  ctx4.fillText(String(uL[i].toFixed(2)), x + arrayL[i] * coefL, 500 - 10);
                  ctx4.lineTo(x + arrayL[i] * coefL, 500);
               }
               else {
                  ctx4.fillText(String(uL[i].toFixed(2)), x + arrayL[i] * coefL, 250 + Math.abs(uL[i]) * coefU + 10);
                  ctx4.lineTo(x + arrayL[i] * coefL, 250 + Math.abs(uL[i]) * coefU);
               }
               ctx4.strokeStyle = 'lightgreen';
               ctx4.stroke();
            }
         }

         x += arrayL[i] * coefL;
         if (i == rodsRows - 1) {
            if (uL[i] <= 0) {
               ctx4.moveTo(x, 250 + Math.abs(uL[i]) * coefU)
            }
            else {
               ctx4.moveTo(x, 250);
            }
            ctx4.lineTo(x, 0);
            ctx4.strokeStyle = 'lightgreen';
            ctx4.stroke();
         }
      }
   }
}

//Компоненты напряжённо-деформированного состояния в конкретном сечении конструкции
function sect() {
   let arrayL = fillArray(arraysOfColumns.arrayL, tables.rodsList, 1);
   let arrayA = fillArray(arraysOfColumns.arrayA, tables.rodsList, 2);
   let arrayE = fillArray(arraysOfColumns.arrayE, tables.rodsList, 3);
   let arrayF = fillArray(arraysOfColumns.arrayF, tables.listF, 1);
   let arrayQ = fillArray(arraysOfColumns.arrayQ, tables.listQ, 1);

   let rodsRows = tables.rodsList.rows.length;
   let rowsF = tables.listF.rows.length;
   let rowsQ = tables.listQ.rows.length;

   //Для таблицы стержней
   for (let r = 0; r < rodsRows; r++) {
      if (isNaN(arrayE[r])) {
         arrayE[r] = 0;
      }
   }
   //Для таблицы сосредоточенных нагрузок
   for (let r = 0; r < rodsRows + 1; r++) {
      if (r >= rowsF) {
         arrayF[r] = 0;
      }
      if (isNaN(arrayF[r])) {
         arrayF[r] = 0;
      }
   }
   //Для таблицы погонных нагрузок
   for (let r = 0; r < rodsRows; r++) {
      if (r >= rowsQ) {
         arrayQ[r] = 0;
      }
      if (isNaN(arrayQ[r])) {
         arrayQ[r] = 0;
      }
   }

   let numberI = document.getElementById('numberI');
   let cut = document.getElementById('cut');
   if (numberI.valueAsNumber == 0) {
      alert('Ошибка! Такого стержня нет');
      return;
   }
   if (numberI.valueAsNumber > tables.rodsList.rows.length) {
      alert('Ошибка! Такого стержня нет');
      return;
   }
   if (cut.valueAsNumber > arrayL[numberI.valueAsNumber]) {
      alert('Ошибка! Длина сечения превышает длину стержня');
      return;
   }

   //Глобальный вектор реакций
   let b = [];
   for (let i = 0; i < rodsRows + 1; i++) {
      if (i == 0) {
         b[i] = arrayF[i] + arrayQ[i] * arrayL[i] / 2;
         b[i + 1] = arrayQ[i] * arrayL[i] / 2;
      }
      else if (i == rodsRows) {
         b[i] = arrayF[i];
         b[i] += arrayQ[i - 1] * arrayL[i - 1] / 2;
      }
      else {
         b[i] += arrayF[i] + arrayQ[i] * arrayL[i] / 2;;
         b[i + 1] = arrayQ[i] * arrayL[i] / 2;
      }
   }

   //Глобальная матрица реакций
   var A = [];
   for (let j = 0; j < rodsRows + 1; j++) {
      A[j] = [];
   }

   for (let i = 0; i < rodsRows + 1; i++) {
      for (let j = 0; j < rodsRows + 1; j++) {
         A[i][j] = 0;
      }
   }

   for (let i = 0; i < rodsRows + 1; i++) {
      let K = (arrayE[i] * arrayA[i]) / arrayL[i];

      if (i == rodsRows) {
         A[rodsRows][rodsRows] = (arrayE[rodsRows - 1] * arrayA[rodsRows - 1]) / arrayL[rodsRows - 1];
      }
      else {
         A[i][i] += K;
         A[i + 1][i + 1] += K;
         A[i + 1][i] -= K;
         A[i][i + 1] -= K;
      }
   }

   //С учётом кинематических условий
   if (document.getElementById('left').checked == true) {
      A[0][0] = 1;
      A[0][1] = 0;
      A[1][0] = 0;
      b[0] = 0;
   }
   if (document.getElementById('right').checked == true) {
      A[rodsRows][rodsRows] = 1;
      A[rodsRows][rodsRows - 1] = 0;
      A[rodsRows - 1][rodsRows] = 0;
      b[rodsRows] = 0;
   }

   let newA = InverseMatrix(A);
   let delta = MultiplyMatrix(newA, b);

   function N(i, x, delta) {
      return (arrayE[i] * arrayA[i] / arrayL[i] * (delta[i + 1] - delta[i]) + arrayQ[i] * arrayL[i] /
         2 * (1 - 2 * x / arrayL[i]));
   }

   function u(i, x, delta) {
      return (delta[i] + (x / arrayL[i]) * (delta[i + 1] - delta[i]) + (arrayQ[i] * arrayL[i] *
         arrayL[i] * x * (1 - x / arrayL[i]) / (2 * arrayE[i] * arrayA[i] * arrayL[i])));
   }

   function sigma(i, x, delta) {
      i = i;
      x = x;
      delta = delta;
      return (N(i, x, delta) / arrayA[i]);
   }

   //Усилие в сечении
   let cutN = N(numberI.valueAsNumber - 1, cut.valueAsNumber, delta);
   document.getElementById('cutN').valueAsNumber = cutN;

   //Напряжение в сечении
   let cutSigma = sigma(numberI.valueAsNumber - 1, cut.valueAsNumber, delta);
   document.getElementById('cutSigma').valueAsNumber = cutSigma;

   //Перемещение в сечении
   let cutU = u(numberI.valueAsNumber - 1, cut.valueAsNumber, delta);
   document.getElementById('cutU').valueAsNumber = cutU;
}

//Рисование кривых с экстремумом на графиках
function drawCurve(ctx, ptsa, tension, isClosed, numOfSegments, showPoints) {

   showPoints = showPoints ? showPoints : false;

   ctx.beginPath();

   drawLines(ctx, getCurvePoints(ptsa, tension, isClosed, numOfSegments));

   if (showPoints) {
      ctx.stroke();
      ctx.beginPath();
      for (var i = 0; i < ptsa.length - 1; i += 2)
         ctx.rect(ptsa[i] - 2, ptsa[i + 1] - 2, 4, 4);
   }
}

function getCurvePoints(pts, tension, isClosed, numOfSegments) {

   tension = (typeof tension != 'undefined') ? tension : 0.5;
   isClosed = isClosed ? isClosed : false;
   numOfSegments = numOfSegments ? numOfSegments : 16;

   var _pts = [], res = [],
      x, y,
      t1x, t2x, t1y, t2y,
      c1, c2, c3, c4,
      st, t, i;

   _pts = pts.slice(0);

   if (isClosed) {
      _pts.unshift(pts[pts.length - 1]);
      _pts.unshift(pts[pts.length - 2]);
      _pts.unshift(pts[pts.length - 1]);
      _pts.unshift(pts[pts.length - 2]);
      _pts.push(pts[0]);
      _pts.push(pts[1]);
   }
   else {
      _pts.unshift(pts[1]);
      _pts.unshift(pts[0]);
      _pts.push(pts[pts.length - 2]);
      _pts.push(pts[pts.length - 1]);
   }

   for (i = 2; i < (_pts.length - 4); i += 2) {
      for (t = 0; t <= numOfSegments; t++) {

         t1x = (_pts[i + 2] - _pts[i - 2]) * tension;
         t2x = (_pts[i + 4] - _pts[i]) * tension;

         t1y = (_pts[i + 3] - _pts[i - 1]) * tension;
         t2y = (_pts[i + 5] - _pts[i + 1]) * tension;

         st = t / numOfSegments;

         c1 = 2 * Math.pow(st, 3) - 3 * Math.pow(st, 2) + 1;
         c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2);
         c3 = Math.pow(st, 3) - 2 * Math.pow(st, 2) + st;
         c4 = Math.pow(st, 3) - Math.pow(st, 2);

         x = c1 * _pts[i] + c2 * _pts[i + 2] + c3 * t1x + c4 * t2x;
         y = c1 * _pts[i + 1] + c2 * _pts[i + 3] + c3 * t1y + c4 * t2y;

         res.push(x);
         res.push(y);
      }
   }
   return res;
}

function drawLines(ctx, pts) {
   ctx.moveTo(pts[0], pts[1]);
   for (i = 2; i < pts.length - 1; i += 2)
      ctx.lineTo(pts[i], pts[i + 1]);
}

//Представление результатов в табличном виде:
function tt() {

   document.getElementById('tabular').style.visibility = 'visible';
   document.getElementById('resultTable').style.visibility = 'visible';

   let rowss = document.getElementById('resultTable').rows.length;
   for (let i = 0; i < rowss; i++) {
      dltRow('resultTable');
   }

   let arrayL = fillArray(arraysOfColumns.arrayL, tables.rodsList, 1);
   let arrayA = fillArray(arraysOfColumns.arrayA, tables.rodsList, 2);
   let arrayE = fillArray(arraysOfColumns.arrayE, tables.rodsList, 3);
   let arraySigma = fillArray(arraysOfColumns.arraySigma, tables.rodsList, 4);
   let arrayF = fillArray(arraysOfColumns.arrayF, tables.listF, 1);
   let arrayQ = fillArray(arraysOfColumns.arrayQ, tables.listQ, 1);

   let rodsRows = tables.rodsList.rows.length;
   let rowsF = tables.listF.rows.length;
   let rowsQ = tables.listQ.rows.length;

   //Для таблицы стержней
   for (let r = 0; r < rodsRows; r++) {
      if (isNaN(arrayE[r])) {
         arrayE[r] = 0;
      }
      if (isNaN(arraySigma[r])) {
         arraySigma[r] = 0;
      }
   }
   //Для таблицы сосредоточенных нагрузок
   for (let r = 0; r < rodsRows + 1; r++) {
      if (r >= rowsF) {
         arrayF[r] = 0;
      }
      if (isNaN(arrayF[r])) {
         arrayF[r] = 0;
      }
   }
   //Для таблицы погонных нагрузок
   for (let r = 0; r < rodsRows; r++) {
      if (r >= rowsQ) {
         arrayQ[r] = 0;
      }
      if (isNaN(arrayQ[r])) {
         arrayQ[r] = 0;
      }
   }

   let numI = document.getElementById('numI');
   let step = document.getElementById('step');

   //Обработка ошибок
   if (numberI.valueAsNumber == 0) {
      alert('Ошибка! Такого стержня нет');
      return;
   }
   if (!(Number.isInteger(numI.valueAsNumber))) {
      alert('Ошибка! Такого стержня нет');
      return;
   }

   if (numI.valueAsNumber > tables.rodsList.rows.length) {
      alert('Ошибка! Такого стержня нет');
      return;
   }

   if (step.valueAsNumber == 0) {
      alert('Ошибка! Задан нулевой шаг');
      return;
   }

   if (step.valueAsNumber >= arrayL[numberI.valueAsNumber - 1]) {
      alert('Ошибка! Слишком большой шаг');
      return;
   }

   let numberOfSteps = arrayL[numI.valueAsNumber - 1] / step.valueAsNumber;
   let numT = Math.floor(numberOfSteps);

   for (let i = 0; i < numT; i++) {
      appendRow('resultTable', 'plusAndMinus', 'read', 'str2');
   }

   if (numT !== numberOfSteps) {
      appendRow('resultTable', 'plusAndMinus', 'read', 'str2');
   }

   //Глобальный вектор реакций
   let b = [];
   for (let i = 0; i < rodsRows + 1; i++) {
      if (i == 0) {
         b[i] = arrayF[i] + arrayQ[i] * arrayL[i] / 2;
         b[i + 1] = arrayQ[i] * arrayL[i] / 2;
      }
      else if (i == rodsRows) {
         b[i] = arrayF[i];
         b[i] += arrayQ[i - 1] * arrayL[i - 1] / 2;
      }
      else {
         b[i] += arrayF[i] + arrayQ[i] * arrayL[i] / 2;;
         b[i + 1] = arrayQ[i] * arrayL[i] / 2;
      }
   }

   //Глобальная матрица реакций
   var A = [];
   for (let j = 0; j < rodsRows + 1; j++) {
      A[j] = [];
   }

   for (let i = 0; i < rodsRows + 1; i++) {
      for (let j = 0; j < rodsRows + 1; j++) {
         A[i][j] = 0;
      }
   }

   for (let i = 0; i < rodsRows + 1; i++) {
      let K = (arrayE[i] * arrayA[i]) / arrayL[i];

      if (i == rodsRows) {
         A[rodsRows][rodsRows] = (arrayE[rodsRows - 1] * arrayA[rodsRows - 1]) / arrayL[rodsRows - 1];
      }
      else {
         A[i][i] += K;
         A[i + 1][i + 1] += K;
         A[i + 1][i] -= K;
         A[i][i + 1] -= K;
      }
   }

   //С учётом кинематических условий
   if (document.getElementById('left').checked == true) {
      A[0][0] = 1;
      A[0][1] = 0;
      A[1][0] = 0;
      b[0] = 0;
   }
   if (document.getElementById('right').checked == true) {
      A[rodsRows][rodsRows] = 1;
      A[rodsRows][rodsRows - 1] = 0;
      A[rodsRows - 1][rodsRows] = 0;
      b[rodsRows] = 0;
   }

   let newA = InverseMatrix(A);
   let delta = MultiplyMatrix(newA, b);

   function N(i, x, delta) {
      return (arrayE[i] * arrayA[i] / arrayL[i] * (delta[i + 1] - delta[i]) + arrayQ[i] * arrayL[i] /
         2 * (1 - 2 * x / arrayL[i]));
   }

   function u(i, x, delta) {
      return (delta[i] + (x / arrayL[i]) * (delta[i + 1] - delta[i]) + (arrayQ[i] * arrayL[i] *
         arrayL[i] * x * (1 - x / arrayL[i]) / (2 * arrayE[i] * arrayA[i] * arrayL[i])));
   }
   function sigma(i, x, delta) {
      i = i;
      x = x;
      delta = delta;
      return (N(i, x, delta) / arrayA[i]);
   }

   let x_ = 0;
   //Заполнение таблицы
   let tabl = document.getElementById('resultTable');

   let quantityOfRows;
   if (numT !== numberOfSteps) {
      quantityOfRows = numT + 2;
   }
   else {
      quantityOfRows = numT + 1;
   }

   for (let i = 0; i < quantityOfRows; i++) {
      tabl.rows[i].cells[1].firstChild.valueAsNumber = parseFloat(x_).toPrecision(12);
      tabl.rows[i].cells[2].firstChild.valueAsNumber = N(numI.valueAsNumber - 1, x_, delta).toFixed(2);
      tabl.rows[i].cells[3].firstChild.valueAsNumber = sigma(numI.valueAsNumber - 1, x_, delta).toFixed(2);
      tabl.rows[i].cells[4].firstChild.valueAsNumber = u(numI.valueAsNumber - 1, x_, delta).toFixed(2);
      tabl.rows[i].cells[5].firstChild.valueAsNumber =
         tables.rodsList.rows[numI.valueAsNumber - 1].cells[4].firstChild.valueAsNumber;

      //Если напряжение по модулю выше допустимого, выделяем цветом
      if (Math.abs(tabl.rows[i].cells[3].firstChild.valueAsNumber) >
         tabl.rows[i].cells[5].firstChild.valueAsNumber) {
         tabl.rows[i].cells[3].firstChild.style.backgroundColor = "#DC143C";
         tabl.rows[i].cells[3].firstChild.style.color = "#F2F4F4";
      }
      //Если напряжение по модулю равно допустимому
      if (Math.abs(tabl.rows[i].cells[3].firstChild.valueAsNumber) ==
         tabl.rows[i].cells[5].firstChild.valueAsNumber) {
         tabl.rows[i].cells[3].firstChild.style.backgroundColor = "#1E90FF";
         tabl.rows[i].cells[3].firstChild.style.color = "#F2F4F4";
      }

      if ((i == quantityOfRows - 2) && (x_ + step.valueAsNumber > arrayL[numI.valueAsNumber - 1])) {
         x_ = arrayL[numI.valueAsNumber - 1];
      }
      else {
         x_ += step.valueAsNumber;
      }
   }

   //Выделяем максимальное напряжение, по модулю не превышающее допустимое
   let maxNum = 0;
   let maxValue = 0;
   for (let i = 0; i < quantityOfRows; i++) {
      if ((Math.abs(tabl.rows[i].cells[3].firstChild.valueAsNumber) > maxValue) && (Math.abs(tabl.rows[i].cells[3].firstChild.valueAsNumber) < tabl.rows[i].cells[5].firstChild.valueAsNumber)) {
         maxValue = Math.abs(tabl.rows[i].cells[3].firstChild.valueAsNumber);
         maxNum = i;
      }
   }
   if (maxNum != 0) {
      tabl.rows[maxNum].cells[3].firstChild.style.backgroundColor = "#F0E68C";
      tabl.rows[maxNum].cells[3].firstChild.style.color = "#000000";
   }
   else {
      if (Math.abs(tabl.rows[0].cells[3].firstChild.valueAsNumber) < tabl.rows[0].cells[5].firstChild.valueAsNumber) {
         tabl.rows[0].cells[3].firstChild.style.backgroundColor = "#F0E68C";
         tabl.rows[0].cells[3].firstChild.style.color = "#000000";
      }
   }
}
