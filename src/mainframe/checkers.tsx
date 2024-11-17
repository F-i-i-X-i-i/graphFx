function checkAdjMatrix(matrix: string): string {
    // Проверить, что матрица не пустая
    

    if ((matrix.length === 0) || (matrix.split(' ').join('') === '')) {
      return "Ошибка: матрица пустая.";
    }
    
    // Проверить, что матрица квадратная
    const rows = matrix.split('\n');
    //const cols = rows[0].split(' ').length; !!! 
    //TODO надо или нет
    for (const row of rows) {
      if (row.trim().split(' ').length !== rows.length) {
        return "Ошибка: матрица не квадратная.";
      }
    }
  
    // Проверить, что в матрице нет отрицательных чисел
    if (matrix.includes('-')) {
      return "Ошибка: в матрице есть отрицательные числа.";
    }
  
    // Проверить, что в матрице нет лишних символов
    for (const char of matrix) {
      if (!char.match(/[0-9\s\n]/)) {
        return "Ошибка: в матрице есть лишние символы.";
      }
    }
  
    return '';
}


function checkIncMatrix(matrix: string): string {
  // Проверить, что матрица не пустая
  

  if ((matrix.length === 0) || (matrix.split(' ').join('') === '')) {
    return "Ошибка: матрица пустая.";
  }
  
  // Проверить, что матрица прямоугольная
  const rows = matrix.split('\n');
  const cols = rows[0].split(' ').length; 
  console.warn('cols: ', cols);
  //TODO надо или нет
  for (const row of rows) {
    if (row.trim().split(' ').length !== cols) {
      return "Ошибка: матрица не прямоугольная.";
    }
  }
  // Проверить, что в матрице нет лишних символов
  for (const char of matrix) {
    if (!char.match(/[0-9\s\n\-]/)) {
      return "Ошибка: в матрице есть лишние символы.";
    }
  }
  let ApologizeIsDirected = false;
  if (matrix.includes('-')) {
      ApologizeIsDirected = true;
    }

  const columns = rows[0].split(' ').map((_, i) => {
    return rows.map(row => row.split(' ')[i]);
  });
  if (columns.some((col, i) => columns.some((otherCol, j) => i !== j && col.every((x, k) => x === otherCol[k])))) {
    return 'Есть одинаковые столбцы';
  }
  for (let i = 0; i < columns.length; i++) {
      const col = columns[i].map(Number);
      let sum = 0;
      for (let j = 0; j < col.length; j++) 
          sum += col[j];
          
      if (ApologizeIsDirected && sum !== 0) 
        return 'Граф предположительно ориентирован (т.к. найдено отрицательное число), но сумма столбца ' + i.toString() + ' не равна 0';
      if (!ApologizeIsDirected && sum !== 2)
        return 'Граф предположительно неориентирован (т.к. не найдены отрицательные числа), но сумма столбца ' + i.toString() + ' не равна 2';
        
  }

  return '';
}





export {checkAdjMatrix, checkIncMatrix}