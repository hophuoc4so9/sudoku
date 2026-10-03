export interface CodeSprintQuestion {
  id: number;
  title: string;
  topic: string;
  description: string;
  code: string;
}

export const CODE_SPRINT_QUESTIONS: CodeSprintQuestion[] = [
  {
    id: 1,
    title: "In ra Xin chào thế giới",
    topic: "Nhập xuất",
    description: "In dòng chữ “Xin chao the gioi” ra màn hình.",
    code: `#include <iostream>\n\nint main() {\n    std::cout << "[[Xin chao the gioi]]";\n    return [[0]];\n}`
  },
  {
    id: 2,
    title: "Tính tổng hai số có sẵn",
    topic: "Biến & phép tính",
    description: "Tính tổng a và b, sau đó in kết quả.",
    code: `#include <iostream>\n\nint main() {\n    int a = [[10]];\n    int b = 5;\n    int sum = a [[+]] b;\n    std::cout << "a + b = " << sum;\n    return 0;\n}`
  },
  {
    id: 3,
    title: "Chu vi và diện tích hình chữ nhật",
    topic: "Biến & phép tính",
    description: "Nhập chiều dài và chiều rộng là hai số nguyên dương.",
    code: `#include <iostream>\n\nint main() {\n    int dai;\n    std::cin >> dai;\n    int rong;\n    std::cin >> rong;\n    int chu_vi = (dai + rong) * [[2]];\n    int dien_tich = dai [[*]] rong;\n    std::cout << "Chu vi = " << chu_vi << "\\nDien tich = " << dien_tich;\n    return 0;\n}`
  },
  {
    id: 4,
    title: "Chu vi và diện tích hình vuông",
    topic: "Biến & phép tính",
    description: "Nhập độ dài cạnh là số nguyên dương.",
    code: `#include <iostream>\n\nint main() {\n    int canh;\n    std::cin >> canh;\n    std::cout << "Chu vi = " << canh * [[4]];\n    std::cout << "\\nDien tich = " << canh [[*]] canh;\n    return 0;\n}`
  },
  {
    id: 5,
    title: "Tính tổng và trung bình cộng",
    topic: "Biến & phép tính",
    description: "Nhập ba số nguyên a, b, c. In tổng và trung bình cộng.",
    code: `#include <iostream>\n\nint main() {\n    int a, b, c;\n    std::cin >> a >> b >> c;\n    int tong = [[a + b + c]];\n    double trung_binh = tong / [[3.0]];\n    std::cout << "Tong = " << tong;\n    std::cout << "\\nTrung binh = " << trung_binh;\n    return 0;\n}`
  },
  {
    id: 6,
    title: "Đổi độ C sang độ F",
    topic: "Biến & phép tính",
    description: "Dùng công thức F = C × 9 / 5 + 32.",
    code: `#include <iostream>\n\nint main() {\n    double c;\n    std::cin >> c;\n    double f = c * [[9.0]] / 5 + [[32]];\n    std::cout << "Nhiet do F = " << f;\n    return 0;\n}`
  },
  {
    id: 7,
    title: "Đổi phút thành giờ và phút",
    topic: "Chia lấy dư",
    description: "Ví dụ: 135 phút = 2 giờ 15 phút.",
    code: `#include <iostream>\n\nint main() {\n    int phut;\n    std::cin >> phut;\n    int gio = phut [[/]] 60;\n    int phut_le = phut % 60;\n    std::cout << gio << " gio " << phut_le << " phut";\n    return 0;\n}`
  },
  {
    id: 8,
    title: "In lời chào nhiều lần",
    topic: "Vòng lặp for",
    description: "Nhập n. Dùng for in “Xin chao” đúng n lần, mỗi lần một dòng.",
    code: `#include <iostream>\n\nint main() {\n    int n;\n    std::cin >> n;\n    for (int i = 1; i <= [[n]]; [[i++]]) {\n        std::cout << "Xin chao\\n";\n    }\n    return 0;\n}`
  },
  {
    id: 9,
    title: "In các số từ 1 đến n",
    topic: "Vòng lặp for",
    description: "Nhập số nguyên dương n, in các số cách nhau một dấu cách.",
    code: `#include <iostream>\n\nint main() {\n    int n;\n    std::cin >> n;\n    for (int i = [[1]]; i <= n; [[i++]]) {\n        std::cout << i << " ";\n    }\n    return 0;\n}`
  },
  {
    id: 10,
    title: "In các số từ n về 1",
    topic: "Vòng lặp for",
    description: "In các số theo thứ tự giảm dần từ n về 1.",
    code: `#include <iostream>\n\nint main() {\n    int n;\n    std::cin >> n;\n    for (int i = n; i >= [[1]]; [[i--]]) {\n        std::cout << i << " ";\n    }\n    return 0;\n}`
  },
  {
    id: 11,
    title: "In các số chẵn",
    topic: "Vòng lặp for",
    description: "In các số chẵn từ 0 đến n. Mỗi bước tăng i thêm 2.",
    code: `#include <iostream>\n\nint main() {\n    int n;\n    std::cin >> n;\n    for (int i = 0; i <= n; i [[+=]] 2) {\n        std::cout << i << " ";\n    }\n    return 0;\n}`
  },
  {
    id: 12,
    title: "Tính tổng từ 1 đến n",
    topic: "Vòng lặp for",
    description: "Dùng for tính tổng 1 + 2 + ... + n.",
    code: `#include <iostream>\n\nint main() {\n    int n;\n    std::cin >> n;\n    long long sum = [[0]];\n    for (int i = 1; i <= n; i++) {\n        sum [[+=]] i;\n    }\n    std::cout << "Tong = " << sum;\n    return 0;\n}`
  },
  {
    id: 13,
    title: "In bảng cửu chương",
    topic: "Vòng lặp for",
    description: "Nhập n và in bảng cửu chương từ nhân 1 đến nhân 10.",
    code: `#include <iostream>\n\nint main() {\n    int n;\n    std::cin >> n;\n    for (int i = [[1]]; i <= [[10]]; i++) {\n        std::cout << n << " x " << i << " = " << n * i << "\\n";\n    }\n    return 0;\n}`
  },
  {
    id: 14,
    title: "Tính giai thừa",
    topic: "Vòng lặp for",
    description: "Tính n! = 1 × 2 × ... × n với n từ 1 đến 20.",
    code: `#include <iostream>\n\nint main() {\n    int n;\n    std::cin >> n;\n    long long giai_thua = [[1]];\n    for (int i = 1; i <= n; i++) {\n        giai_thua [[*=]] i;\n    }\n    std::cout << "Giai thua = " << giai_thua;\n    return 0;\n}`
  },
  {
    id: 15,
    title: "Tính tổng các số được nhập",
    topic: "Vòng lặp for",
    description: "Nhập n rồi nhập tiếp n số nguyên. Không dùng mảng.",
    code: `#include <iostream>\n\nint main() {\n    int n;\n    std::cin >> n;\n    long long tong = [[0]];\n    for (int i = 1; i <= n; i++) {\n        int x;\n        std::cin >> x;\n        tong [[+=]] x;\n    }\n    std::cout << "Tong = " << tong;\n    return 0;\n}`
  },
  {
    id: 16,
    title: "In dãy số bằng while",
    topic: "Vòng lặp while",
    description: "Dùng while in các số từ 1 đến n.",
    code: `#include <iostream>\n\nint main() {\n    int n;\n    std::cin >> n;\n    int i = [[1]];\n    while (i <= n) {\n        std::cout << i << " ";\n        [[i++]];\n    }\n    return 0;\n}`
  },
  {
    id: 17,
    title: "Đếm chữ số",
    topic: "Vòng lặp while",
    description: "Đếm số chữ số của số nguyên dương n.",
    code: `#include <iostream>\n\nint main() {\n    int n;\n    std::cin >> n;\n    int dem = 0;\n    while (n > [[0]]) {\n        dem++;\n        n [[/=]] 10;\n    }\n    std::cout << "So chu so = " << dem;\n    return 0;\n}`
  },
  {
    id: 18,
    title: "Tính tổng các chữ số",
    topic: "Vòng lặp while",
    description: "Ví dụ: số 123 có tổng chữ số là 6.",
    code: `#include <iostream>\n\nint main() {\n    int n;\n    std::cin >> n;\n    int tong = 0;\n    while (n > 0) {\n        tong += n [[%]] 10;\n        n /= 10;\n    }\n    std::cout << "Tong chu so = " << tong;\n    return 0;\n}`
  },
  {
    id: 19,
    title: "Nhập đến khi có số dương",
    topic: "Vòng lặp do...while",
    description: "Nếu số vừa nhập không dương thì yêu cầu nhập lại.",
    code: `#include <iostream>\n\nint main() {\n    int n;\n    do {\n        std::cout << "Nhap so nguyen duong: ";\n        std::cin >> n;\n    } while (n [[<=]] 0);\n    std::cout << "So da nhap = " << n;\n    return 0;\n}`
  },
  {
    id: 20,
    title: "Nhập số 0 để kết thúc",
    topic: "Vòng lặp do...while",
    description: "Nhập liên tiếp các số nguyên, dừng khi nhập 0 và in tổng.",
    code: `#include <iostream>\n\nint main() {\n    int x;\n    long long tong = 0;\n    do {\n        std::cin >> x;\n        tong [[+=]] x;\n    } while (x [[!=]] 0);\n    std::cout << "Tong = " << tong;\n    return 0;\n}`
  }
];

export function parseQuestionSlots(question: CodeSprintQuestion) {
  const parts = question.code.split(/(\[\[.*?\]\])/g);
  const slots: string[] = [];
  const renderedParts: { text: string; isSlot: boolean; slotIndex?: number }[] = [];

  parts.forEach(part => {
    if (part.startsWith('[[') && part.endsWith(']]')) {
      const answer = part.slice(2, -2);
      slots.push(answer);
      renderedParts.push({ text: answer, isSlot: true, slotIndex: slots.length - 1 });
    } else {
      renderedParts.push({ text: part, isSlot: false });
    }
  });

  return { slots, renderedParts };
}

export function generateDistractors(answer: string): string[] {
  const groups = [
    {
      test: (v: string) => ["+", "-", "*", "/", "%", "<=", "!=", "+=", "*=", "/="].includes(v),
      values: ["+", "-", "*", "/", "%", "<=", "!=", "+=", "*=", "/=", ">=", "=="]
    },
    {
      test: (v: string) => /^\d+(?:\.\d+)?$/.test(v),
      values: ["0", "1", "2", "3", "4", "5", "10", "20", "32", "60", "9.0", "3.0", "100"]
    },
    {
      test: (v: string) => v.startsWith("Xin chao"),
      values: ["Xin chao", "Xin chao the gioi", "Hello world", "Chao ban", "C++ Programming"]
    },
    {
      test: (v: string) => ["i++", "i--"].includes(v),
      values: ["i++", "i--", "++i", "--i", "i = 1", "i = n"]
    },
    {
      test: (v: string) => v === "n",
      values: ["n", "i", "0", "1", "10"]
    },
    {
      test: (v: string) => v === "a + b + c",
      values: ["a + b + c", "a * b * c", "(a + b) * c", "a + b - c"]
    }
  ];

  const matched = groups.find(g => g.test(answer));
  let pool = matched ? matched.values.filter(v => v !== answer) : ["0", "1", "x", "n"];

  // Shuffle pool
  pool = [...pool].sort(() => Math.random() - 0.5);

  const selectedDistractors = pool.slice(0, 3);
  const allChoices = [answer, ...selectedDistractors].sort(() => Math.random() - 0.5);
  return allChoices;
}
