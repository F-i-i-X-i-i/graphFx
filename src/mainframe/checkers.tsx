function checkMatrix(matrix: string): string {
    // Проверить, что матрица не пустая
    

    if (matrix.length === 0 || matrix.split(' ').join('') === '') {
      return "Ошибка: матрица пустая.";
    }
  
    // Проверить, что матрица квадратная
    const rows = matrix.split('\n');
    const cols = rows[0].split(' ').length;
    for (const row of rows) {
        console.log('\t', row.trim());
      if (row.trim().split(' ').length !== cols) {
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

export {checkMatrix}