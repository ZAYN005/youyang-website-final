/**
 * Human-readable labels for message keys shown in 内容管理.
 * A key such as "products.sentinel.advantages.items.one.title" becomes
 * "产品优势 › 第1项 › 标题" / "Advantages › Item 1 › Title".
 */

type Dict = Record<string, [string, string]>;

const WORDS: Dict = {
  hero: ["首屏横幅", "Hero"],
  overview: ["概述", "Overview"],
  title: ["标题", "Title"],
  heading: ["主标题", "Heading"],
  heroTitle: ["产品名称（标题）", "Product name (heading)"],
  description: ["描述", "Description"],
  description1: ["第1段", "Paragraph 1"],
  description2: ["第2段", "Paragraph 2"],
  description3: ["第3段", "Paragraph 3"],
  description4: ["第4段", "Paragraph 4"],
  label: ["小标签", "Small label"],
  button: ["按钮文字", "Button text"],
  items: ["条目", "Items"],
  advantages: ["产品优势", "Advantages"],
  specifications: ["技术参数", "Specifications"],
  parameter: ["参数名称列", "Parameter column"],
  comparison: ["方案对比", "Comparison"],
  traditional: ["传统方案", "Traditional"],
  product: ["本产品", "This product"],
  coverage: ["应用覆盖", "Coverage"],
  capabilities: ["核心能力", "Capabilities"],
  capabilityTitle: ["核心能力标题", "Capabilities heading"],
  cta: ["底部引导区", "Call to action"],
  highlight: ["亮点内容", "Highlight"],
  highlightTitle: ["亮点标题", "Highlight title"],
  mission: ["使命", "Mission"],
  vision: ["愿景", "Vision"],
  name: ["名称", "Name"],
  fullName: ["全称", "Full name"],
  model: ["型号", "Model"],
  established: ["成立时间标签", "Founded label"],
  year: ["成立年份", "Founding year"],
  establishedDescription: ["成立时间卡片说明", "Founding card text"],
  cultureLabel: ["小标签", "Small label"],
  cultureTitle: ["模块标题", "Block title"],
  faq: ["常见问题", "FAQ"],
  faqTitle: ["常见问题标题", "FAQ heading"],
  question: ["问题", "Question"],
  answer: ["回答", "Answer"],
  q1: ["问题1", "Question 1"],
  q2: ["问题2", "Question 2"],
  q3: ["问题3", "Question 3"],
  form: ["表单", "Form"],
  fields: ["输入框提示", "Field placeholders"],
  messages: ["提示信息", "Messages"],
  success: ["提交成功", "Success"],
  failed: ["提交失败", "Failed"],
  error: ["出错提示", "Error"],
  sending: ["提交中", "Sending"],
  submit: ["提交按钮", "Submit button"],
  information: ["联系信息栏目名", "Contact info labels"],
  info: ["联系方式", "Contact details"],
  email: ["邮箱", "Email"],
  phone: ["电话", "Phone"],
  address: ["地址", "Address"],
  addressTitle: ["地址栏目标题", "Address column title"],
  wechatScan: ["二维码提示文字", "QR caption"],
  benefits: ["优势介绍", "Benefits"],
  features: ["功能特点", "Features"],
  explore: ["查看按钮文字", "Explore link text"],
  copyright: ["版权信息", "Copyright"],
  follow: ["关注我们标题", "Follow us title"],
  contactTitle: ["联系栏目标题", "Contact column title"],
  privacy: ["隐私政策", "Privacy"],
  terms: ["条款", "Terms"],
  company: ["公司栏目", "Company column"],
  products: ["产品", "Products"],
  solutions: ["解决方案", "Solutions"],
  solution: ["解决方案", "Solution"],
  solutionLabel: ["方案小标签", "Solution label"],
  coreValue: ["核心价值标题", "Core value title"],
  architecture: ["架构图模块", "Architecture"],
  applications: ["应用场景", "Applications"],
  application: ["应用场景", "Application"],
  support: ["支持", "Support"],
  supportTitle: ["支持标题", "Support title"],
  downloads: ["资料下载", "Downloads"],
  category: ["分类", "Category"],
  comingSoon: ["即将上线", "Coming soon"],
  home: ["首页", "Home"],
  contact: ["联系我们", "Contact"],
  about: ["关于我们", "About"],
  technology: ["技术", "Technology"],
  rd: ["研发能力", "R&D"],
  partners: ["合作伙伴", "Partners"],
  sentinel: ["360哨兵", "360 Sentinel"],
  dome: ["云瞰", "Dome Watch"],
  guardian: ["广域卫士", "Wide-area Guardian"],
  one: ["第1项", "Item 1"],
  two: ["第2项", "Item 2"],
  three: ["第3项", "Item 3"],
  four: ["第4项", "Item 4"],
  five: ["第5项", "Item 5"],
  six: ["第6项", "Item 6"],
  country: ["国家/地区", "Country"],
  message: ["留言", "Message"],
};

/** words whose meaning depends on the parent key */
const CONTEXT: Record<string, Dict> = {
  values: {
    company: ["价值观", "Values"],
    specifications: ["参数值列", "Value column"],
    "*": ["核心价值", "Core values"],
  },
  value: {
    specifications: ["参数值", "Value"],
    "*": ["价值", "Value"],
  },
};

/**
 * Builds a label for a key, dropping the section's own prefix so labels stay short.
 */
export function labelForKey(key: string, sectionPrefixes: string[]): { zh: string; en: string } {
  const prefix = sectionPrefixes
    .filter((p) => key === p || key.startsWith(p + "."))
    .sort((a, b) => b.length - a.length)[0];

  const parts = key.split(".");
  let start = 0;
  if (prefix) {
    const prefixParts = prefix.split(".").length;
    // keep the last segment when the key IS the prefix
    start = Math.min(prefixParts, parts.length - 1);
    // when a section combines several prefixes, keep the last segment of the
    // prefix for context (e.g. "mission › title" vs "vision › title")
    if (sectionPrefixes.length > 1 && prefixParts > 1 && key !== prefix) {
      start = prefixParts - 1;
    }
  }

  const shown = parts.slice(start);
  const zh: string[] = [];
  const en: string[] = [];

  shown.forEach((word, i) => {
    const parent = parts[start + i - 1] ?? "";
    const ctx = CONTEXT[word];
    let pair: [string, string] | undefined;
    if (ctx) pair = ctx[parent] ?? ctx["*"];
    if (!pair) pair = WORDS[word];
    zh.push(pair ? pair[0] : word);
    en.push(pair ? pair[1] : word);
  });

  return { zh: zh.join(" › "), en: en.join(" › ") };
}
