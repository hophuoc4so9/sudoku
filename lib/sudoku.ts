/**
 * SUDOKU 6x6 LOGIC & BACKTRACKING SOLVER
 * 
 * Bảng 6x6 được chia thành 6 khối hình chữ nhật kích thước 2 hàng x 3 cột (2x3).
 * Mỗi hàng, mỗi cột và mỗi khối 2x3 phải chứa các số từ 1 đến 6 không trùng lặp.
 */

// Bảng Sudoku 6x6 mẫu dành cho tân sinh viên (độ khó vừa phải, thân thiện nhưng cần suy luận logic)
// 0 đại diện cho ô trống
export const INITIAL_PUZZLE: number[][] = [
  [0, 0, 3, 0, 1, 0],
  [5, 6, 0, 3, 2, 0],
  [0, 5, 4, 2, 0, 3],
  [2, 0, 6, 4, 5, 0],
  [0, 1, 2, 0, 4, 5],
  [0, 4, 0, 1, 0, 0],
];

/**
 * Kiểm tra xem đặt `num` vào vị trí (row, col) có hợp lệ không (theo hàng, cột và khối 2x3).
 */
export function isValidPlacement(board: number[][], row: number, col: number, num: number): boolean {
  // 1. Kiểm tra hàng
  for (let c = 0; c < 6; c++) {
    if (board[row][c] === num) return false;
  }

  // 2. Kiểm tra cột
  for (let r = 0; r < 6; r++) {
    if (board[r][col] === num) return false;
  }

  // 3. Kiểm tra khối 2x3 (2 hàng x 3 cột)
  const startRow = Math.floor(row / 2) * 2;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[startRow + r][startCol + c] === num) return false;
    }
  }

  return true;
}

/**
 * Thuật toán Quay lui (Backtracking) để giải Sudoku 6x6.
 * Trả về bản sao của bảng đã giải, hoặc null nếu không có nghiệm.
 */
export function solveSudoku6x6(board: number[][]): number[][] | null {
  // Tạo deep copy bảng để không mutate bảng gốc
  const solved = board.map((row) => [...row]);

  function backtrack(): boolean {
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        if (solved[r][c] === 0) {
          for (let num = 1; num <= 6; num++) {
            if (isValidPlacement(solved, r, c, num)) {
              solved[r][c] = num;
              if (backtrack()) return true;
              solved[r][c] = 0; // Quay lui
            }
          }
          return false; // Không tìm được số phù hợp cho ô trống này
        }
      }
    }
    return true; // Tất cả các ô đã được điền hợp lệ
  }

  const success = backtrack();
  return success ? solved : null;
}

/**
 * Đo thời gian giải bằng thuật toán Backtracking (đơn vị: giây, dạng string thập phân).
 */
export function benchmarkBacktracking(board: number[][]): { solvedBoard: number[][] | null; elapsedSeconds: string } {
  const start = performance.now();
  const solved = solveSudoku6x6(board);
  const end = performance.now();
  const elapsed = (end - start) / 1000;
  // Làm tròn chuẩn hiển thị, thường dưới 0.005s cho 6x6
  const formatted = elapsed < 0.001 ? "0.001" : elapsed.toFixed(3);
  return { solvedBoard: solved, elapsedSeconds: formatted };
}

/**
 * Kiểm tra xem bảng nộp lên đã điền đầy đủ (từ 1 đến 6, không còn số 0)
 * và tuân thủ hoàn toàn luật Sudoku 6x6 (hàng, cột, khối 2x3).
 */
export function isBoardValid(board: number[][]): boolean {
  if (!board || board.length !== 6) return false;

  // 1. Kiểm tra từng hàng (phải gồm đúng các số 1..6)
  for (let r = 0; r < 6; r++) {
    if (!board[r] || board[r].length !== 6) return false;
    const seen = new Set<number>();
    for (let c = 0; c < 6; c++) {
      const val = board[r][c];
      if (typeof val !== 'number' || val < 1 || val > 6) return false;
      if (seen.has(val)) return false;
      seen.add(val);
    }
  }

  // 2. Kiểm tra từng cột
  for (let c = 0; c < 6; c++) {
    const seen = new Set<number>();
    for (let r = 0; r < 6; r++) {
      const val = board[r][c];
      if (seen.has(val)) return false;
      seen.add(val);
    }
  }

  // 3. Kiểm tra 6 khối 2x3
  // Khối r = 0, 2, 4 (bước nhảy 2 hàng)
  // Khối c = 0, 3    (bước nhảy 3 cột)
  for (let blockRow = 0; blockRow < 6; blockRow += 2) {
    for (let blockCol = 0; blockCol < 6; blockCol += 3) {
      const seen = new Set<number>();
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 3; c++) {
          const val = board[blockRow + r][blockCol + c];
          if (seen.has(val)) return false;
          seen.add(val);
        }
      }
    }
  }

  return true;
}
