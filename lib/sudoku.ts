/**
 * SUDOKU 6x6 LOGIC, GENERATOR & BACKTRACKING SOLVER
 *
 * Bảng 6x6 chia thành 6 khối chữ nhật kích thước 2 hàng x 3 cột (2x3).
 * Mỗi hàng, mỗi cột và mỗi khối 2x3 chứa các số từ 1 đến 6 không trùng lặp.
 */

export const DEFAULT_PUZZLE: number[][] = [
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
  for (let c = 0; c < 6; c++) {
    if (board[row][c] === num) return false;
  }
  for (let r = 0; r < 6; r++) {
    if (board[r][col] === num) return false;
  }
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
 * Trộn ngẫu nhiên mảng (Fisher-Yates)
 */
function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Thuật toán Quay lui (Backtracking) để giải Sudoku 6x6.
 * Có tùy chọn randomized để sinh nghiệm ngẫu nhiên khi tạo đề mới.
 */
export function solveSudoku6x6(board: number[][], randomized = false): number[][] | null {
  const solved = board.map((row) => [...row]);

  function backtrack(): boolean {
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        if (solved[r][c] === 0) {
          const numbers = randomized ? shuffleArray([1, 2, 3, 4, 5, 6]) : [1, 2, 3, 4, 5, 6];
          for (const num of numbers) {
            if (isValidPlacement(solved, r, c, num)) {
              solved[r][c] = num;
              if (backtrack()) return true;
              solved[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  const success = backtrack();
  return success ? solved : null;
}

/**
 * Đếm số lượng nghiệm của 1 đề (dừng sớm nếu > 1 nghiệm để tối ưu hiệu năng).
 */
export function countSolutions(board: number[][], limit = 2): number {
  const copy = board.map((row) => [...row]);
  let count = 0;

  function backtrack(): boolean {
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        if (copy[r][c] === 0) {
          for (let num = 1; num <= 6; num++) {
            if (isValidPlacement(copy, r, c, num)) {
              copy[r][c] = num;
              if (backtrack()) return true;
              copy[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    count++;
    return count >= limit;
  }

  backtrack();
  return count;
}

/**
 * TẠO ĐỀ SUDOKU 6x6 NGẪU NHIÊN CHO MỖI NGƯỜI
 * - Đảm bảo có nghiệm DUY NHẤT (Unique Solution).
 * - cluesCount: số ô gợi ý ban đầu (mặc định 18 ô - vừa sức cho tân sinh viên).
 */
export function generateRandomSudoku6x6(cluesCount = 18): { puzzle: number[][]; solution: number[][] } {
  // 1. Tạo 1 bảng rỗng và giải ngẫu nhiên để có 1 nghiệm hoàn chỉnh
  const emptyBoard = Array.from({ length: 6 }, () => Array(6).fill(0));
  const fullSolution = solveSudoku6x6(emptyBoard, true);

  if (!fullSolution) {
    // Fallback nếu có lỗi bất ngờ
    const defaultSol = solveSudoku6x6(DEFAULT_PUZZLE)!;
    return { puzzle: DEFAULT_PUZZLE.map((r) => [...r]), solution: defaultSol };
  }

  const puzzle = fullSolution.map((row) => [...row]);

  // 2. Tạo danh sách 36 vị trí và xáo trộn ngẫu nhiên
  const positions: [number, number][] = [];
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      positions.push([r, c]);
    }
  }
  const shuffledPositions = shuffleArray(positions);

  let currentClues = 36;

  // 3. Đào bới các ô ngẫu nhiên nhưng vẫn giữ nghiệm duy nhất
  for (const [r, c] of shuffledPositions) {
    if (currentClues <= cluesCount) break;

    const originalVal = puzzle[r][c];
    puzzle[r][c] = 0;

    // Kiểm tra xem đề vẫn có nghiệm duy nhất không
    if (countSolutions(puzzle, 2) === 1) {
      currentClues--;
    } else {
      puzzle[r][c] = originalVal; // Phục hồi lại nếu việc xóa làm mất tính duy nhất
    }
  }

  return { puzzle, solution: fullSolution };
}

/**
 * Đo thời gian giải bằng thuật toán Backtracking (đơn vị: giây, dạng string).
 */
export function benchmarkBacktracking(board: number[][]): { solvedBoard: number[][] | null; elapsedSeconds: string } {
  const start = performance.now();
  const solved = solveSudoku6x6(board);
  const end = performance.now();
  const elapsed = (end - start) / 1000;
  const formatted = elapsed < 0.001 ? '0.001' : elapsed.toFixed(3);
  return { solvedBoard: solved, elapsedSeconds: formatted };
}

/**
 * Kiểm tra xem bảng nộp lên đã điền đầy đủ và tuân thủ hoàn toàn luật Sudoku 6x6.
 */
export function isBoardValid(board: number[][]): boolean {
  if (!board || board.length !== 6) return false;

  // 1. Kiểm tra từng hàng
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

/** Bài nộp phải giữ nguyên các ô gợi ý của đề ban đầu. */
export function matchesPuzzle(board: number[][], puzzle: number[][]): boolean {
  if (!puzzle || !board) return false;
  return puzzle.every((row, r) => row.every((v, c) => v === 0 || board?.[r]?.[c] === v));
}
