import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Danh sách câu hỏi C++ mẫu với:
// - title: Tiêu đề câu hỏi
// - topic: Chủ đề kiến thức
// - description: Yêu cầu đề bài
// - code: Đoạn code C++ (chứa [[đáp án]] đánh dấu ô cần điền)
// - correctAnswer: Đáp án đúng
// - options: Danh sách 4 lựa chọn trắc nghiệm A, B, C, D
export const QUESTIONS = [
  {
    id: 1,
    title: "In ra Xin chào thế giới",
    topic: "Nhập xuất",
    description: "In dòng chữ “Xin chao the gioi” ra màn hình.",
    code: `#include <iostream>\n\nint main() {\n    std::cout << "[[Xin chao the gioi]]";\n    return 0;\n}`,
    correctAnswer: "Xin chao the gioi",
    options: ["Xin chao the gioi", "Hello world", "Xin chao", "Chao the gioi"]
  },
  {
    id: 2,
    title: "Tính tổng hai số có sẵn",
    topic: "Biến & phép tính",
    description: "Tính tổng a và b, sau đó in kết quả.",
    code: `#include <iostream>\n\nint main() {\n    int a = 10;\n    int b = 5;\n    int sum = a [[+]] b;\n    std::cout << "a + b = " << sum;\n    return 0;\n}`,
    correctAnswer: "+",
    options: ["+", "-", "*", "/"]
  },
  {
    id: 3,
    title: "Chu vi và diện tích hình chữ nhật",
    topic: "Biến & phép tính",
    description: "Nhập chiều dài và chiều rộng là hai số nguyên dương.",
    code: `#include <iostream>\n\nint main() {\n    int dai;\n    std::cin >> dai;\n    int rong;\n    std::cin >> rong;\n    int chu_vi = (dai + rong) * [[2]];\n    int dien_tich = dai * rong;\n    std::cout << "Chu vi = " << chu_vi << "\\nDien tich = " << dien_tich;\n    return 0;\n}`,
    correctAnswer: "2",
    options: ["2", "4", "3", "1"]
  },
  {
    id: 4,
    title: "Chu vi và diện tích hình vuông",
    topic: "Biến & phép tính",
    description: "Nhập độ dài cạnh là số nguyên dương.",
    code: `#include <iostream>\n\nint main() {\n    int canh;\n    std::cin >> canh;\n    std::cout << "Chu vi = " << canh * [[4]];\n    std::cout << "\\nDien tich = " << canh * canh;\n    return 0;\n}`,
    correctAnswer: "4",
    options: ["4", "2", "3", "5"]
  },
  {
    id: 5,
    title: "Tính tổng và trung bình cộng",
    topic: "Biến & phép tính",
    description: "Nhập ba số nguyên a, b, c. In tổng và trung bình cộng.",
    code: `#include <iostream>\n\nint main() {\n    int a, b, c;\n    std::cin >> a >> b >> c;\n    int tong = a + b + c;\n    double trung_binh = tong / [[3.0]];\n    std::cout << "Tong = " << tong;\n    std::cout << "\\nTrung binh = " << trung_binh;\n    return 0;\n}`,
    correctAnswer: "3.0",
    options: ["3.0", "2.0", "4.0", "3"]
  },
  {
    id: 6,
    title: "Đổi độ C sang độ F",
    topic: "Biến & phép tính",
    description: "Dùng công thức F = C × 9 / 5 + 32.",
    code: `#include <iostream>\n\nint main() {\n    double c;\n    std::cin >> c;\n    double f = c * [[9.0]] / 5 + 32;\n    std::cout << "Nhiet do F = " << f;\n    return 0;\n}`,
    correctAnswer: "9.0",
    options: ["9.0", "5.0", "32.0", "1.8"]
  },
  {
    id: 7,
    title: "Đổi phút thành giờ và phút",
    topic: "Chia lấy dư",
    description: "Ví dụ: 135 phút = 2 giờ 15 phút.",
    code: `#include <iostream>\n\nint main() {\n    int phut;\n    std::cin >> phut;\n    int gio = phut [[/]] 60;\n    int phut_le = phut % 60;\n    std::cout << gio << " gio " << phut_le << " phut";\n    return 0;\n}`,
    correctAnswer: "/",
    options: ["/", "%", "*", "+"]
  },
  {
    id: 8,
    title: "Kiểm tra số chẵn hay lẻ",
    topic: "Cấu trúc rẽ nhánh",
    description: "Nhập số nguyên n, kiểm tra n là số chẵn hay số lẻ.",
    code: `#include <iostream>\n\nint main() {\n    int n;\n    std::cin >> n;\n    if (n % [[2]] == 0) {\n        std::cout << "Chan";\n    } else {\n        std::cout << "Le";\n    }\n    return 0;\n}`,
    correctAnswer: "2",
    options: ["2", "3", "1", "0"]
  },
  {
    id: 9,
    title: "Tìm số lớn nhất trong hai số",
    topic: "Cấu trúc rẽ nhánh",
    description: "Nhập hai số nguyên a và b. In ra số lớn hơn.",
    code: `#include <iostream>\n\nint main() {\n    int a, b;\n    std::cin >> a >> b;\n    if (a [[>]] b) {\n        std::cout << "Max: " << a;\n    } else {\n        std::cout << "Max: " << b;\n    }\n    return 0;\n}`,
    correctAnswer: ">",
    options: [">", "<", "==", "!="]
  },
  {
    id: 10,
    title: "Kiểm tra số âm, dương hay số 0",
    topic: "Cấu trúc rẽ nhánh",
    description: "Nhập số nguyên n. Xác định n > 0, n < 0 hay n == 0.",
    code: `#include <iostream>\n\nint main() {\n    int n;\n    std::cin >> n;\n    if (n > 0) {\n        std::cout << "Duong";\n    } else if (n [[<]] 0) {\n        std::cout << "Am";\n    } else {\n        std::cout << "Khong";\n    }\n    return 0;\n}`,
    correctAnswer: "<",
    options: ["<", ">", "==", "!="]
  },
  {
    id: 11,
    title: "Kiểm tra năm nhuận",
    topic: "Toán tử logic",
    description: "Năm nhuận chia hết cho 400 hoặc chia hết cho 4 nhưng không chia hết cho 100.",
    code: `#include <iostream>\n\nint main() {\n    int year;\n    std::cin >> year;\n    if ((year % 4 == 0 && year % 100 != 0) [[||]] (year % 400 == 0)) {\n        std::cout << "Nam nhuan";\n    } else {\n        std::cout << "Khong nhuan";\n    }\n    return 0;\n}`,
    correctAnswer: "||",
    options: ["||", "&&", "==", "!="]
  },
  {
    id: 12,
    title: "In các số từ 1 đến N",
    topic: "Vòng lặp for",
    description: "Nhập số nguyên dương n. In các số từ 1 đến n trên cùng một dòng.",
    code: `#include <iostream>\n\nint main() {\n    int n;\n    std::cin >> n;\n    for (int i = 1; i [[<=]] n; i++) {\n        std::cout << i << " ";\n    }\n    return 0;\n}`,
    correctAnswer: "<=",
    options: ["<=", ">=", "<", "=="]
  },
  {
    id: 13,
    title: "Tính tổng từ 1 đến N",
    topic: "Vòng lặp for",
    description: "Tính tổng S = 1 + 2 + ... + n.",
    code: `#include <iostream>\n\nint main() {\n    int n;\n    std::cin >> n;\n    int sum = 0;\n    for (int i = 1; i <= n; i++) {\n        sum [[+=]] i;\n    }\n    std::cout << "Tong = " << sum;\n    return 0;\n}`,
    correctAnswer: "+=",
    options: ["+=", "-=", "*=", "="]
  },
  {
    id: 14,
    title: "Tính giai thừa của N",
    topic: "Vòng lặp for",
    description: "Tính n! = 1 * 2 * ... * n (với n >= 1).",
    code: `#include <iostream>\n\nint main() {\n    int n;\n    std::cin >> n;\n    long long gt = 1;\n    for (int i = 1; i <= n; i++) {\n        gt = gt [[*]] i;\n    }\n    std::cout << n << "! = " << gt;\n    return 0;\n}`,
    correctAnswer: "*",
    options: ["*", "+", "/", "%"]
  },
  {
    id: 15,
    title: "In bảng cửu chương",
    topic: "Vòng lặp for",
    description: "Nhập số k (1 <= k <= 9). In bảng cửu chương của k từ 1 đến 10.",
    code: `#include <iostream>\n\nint main() {\n    int k;\n    std::cin >> k;\n    for (int i = 1; i <= 10; [[i++]]) {\n        std::cout << k << " x " << i << " = " << k * i << "\\n";\n    }\n    return 0;\n}`,
    correctAnswer: "i++",
    options: ["i++", "i--", "i += 2", "++k"]
  },
  {
    id: 16,
    title: "Đếm số chữ số của một số nguyên",
    topic: "Vòng lặp while",
    description: "Nhập số nguyên dương n. Đếm xem n có bao nhiêu chữ số.",
    code: `#include <iostream>\n\nint main() {\n    int n;\n    std::cin >> n;\n    int count = 0;\n    while (n > 0) {\n        count++;\n        n = n [[/]] 10;\n    }\n    std::cout << "So chu so: " << count;\n    return 0;\n}`,
    correctAnswer: "/",
    options: ["/", "%", "*", "-"]
  },
  {
    id: 17,
    title: "Nhập và in mảng một chiều",
    topic: "Mảng 1 chiều",
    description: "Nhập n phần tử của mảng a, sau đó in các phần tử ra màn hình.",
    code: `#include <iostream>\n\nint main() {\n    int n;\n    std::cin >> n;\n    int a[100];\n    for (int i = 0; i < n; i++) {\n        std::cin >> [[a[i]]];\n    }\n    for (int i = 0; i < n; i++) {\n        std::cout << a[i] << " ";\n    }\n    return 0;\n}`,
    correctAnswer: "a[i]",
    options: ["a[i]", "a[n]", "i", "a"]
  },
  {
    id: 18,
    title: "Tính tổng các phần tử trong mảng",
    topic: "Mảng 1 chiều",
    description: "Nhập mảng n số nguyên, tính tổng tất cả các phần tử.",
    code: `#include <iostream>\n\nint main() {\n    int n;\n    std::cin >> n;\n    int a[100];\n    for (int i = 0; i < n; i++) {\n        std::cin >> a[i];\n    }\n    int sum = 0;\n    for (int i = 0; i < n; i++) {\n        sum += [[a[i]]];\n    }\n    std::cout << "Tong mang = " << sum;\n    return 0;\n}`,
    correctAnswer: "a[i]",
    options: ["a[i]", "i", "n", "a[0]"]
  },
  {
    id: 19,
    title: "Tìm phần tử lớn nhất trong mảng",
    topic: "Mảng 1 chiều",
    description: "Nhập mảng n số nguyên, tìm giá trị lớn nhất max_val.",
    code: `#include <iostream>\n\nint main() {\n    int n;\n    std::cin >> n;\n    int a[100];\n    for (int i = 0; i < n; i++) std::cin >> a[i];\n    int max_val = a[0];\n    for (int i = 1; i < n; i++) {\n        if (a[i] [[>]] max_val) {\n            max_val = a[i];\n        }\n    }\n    std::cout << "Max = " << max_val;\n    return 0;\n}`,
    correctAnswer: ">",
    options: [">", "<", ">=", "=="]
  },
  {
    id: 20,
    title: "Hàm tính lũy thừa bậc hai",
    topic: "Hàm (Function)",
    description: "Viết hàm square(x) trả về bình phương của một số nguyên x.",
    code: `#include <iostream>\n\nint square(int x) {\n    return [[x * x]];\n}\n\nint main() {\n    int a = 6;\n    std::cout << "Binh phuong: " << square(a);\n    return 0;\n}`,
    correctAnswer: "x * x",
    options: ["x * x", "x + x", "2 * x", "x * 2"]
  }
];

async function main() {
  console.log('🌱 Bắt đầu nạp/cập nhật 20 câu hỏi C++ vào Neon PostgreSQL...');
  let count = 0;

  for (const q of QUESTIONS) {
    await prisma.codeQuestion.upsert({
      where: { id: q.id },
      update: {
        title: q.title,
        topic: q.topic,
        description: q.description,
        code: q.code,
        correctAnswer: q.correctAnswer,
        options: q.options,
      },
      create: {
        id: q.id,
        title: q.title,
        topic: q.topic,
        description: q.description,
        code: q.code,
        correctAnswer: q.correctAnswer,
        options: q.options,
      },
    });
    count++;
  }

  // Cập nhật sequence autoincrement của Postgres
  try {
    await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('"CodeQuestion"', 'id'), coalesce(max(id), 0) + 1, false) FROM "CodeQuestion";`
    );
  } catch (err) {}

  console.log(`✅ Đã nạp thành công ${count} câu hỏi C++ với đáp án và 4 phương án trắc nghiệm!`);
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
