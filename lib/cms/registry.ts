/**
 * 内容管理 (Content Management) — structure of the admin content tree.
 *
 * Every text on the website comes from messages/zh.json and messages/en.json.
 * Each section below lists which message keys it owns ("include" prefixes),
 * and which image fields it manages. Edits are stored in the database
 * (ContentOverride) and merged over the JSON files at request time.
 */

export type ImageKind = "single" | "gallery";

export interface CmsImageField {
  /** message key holding the image path (single) or list of paths (gallery) */
  key: string;
  label: { zh: string; en: string };
  kind: ImageKind;
  /** minimum number of images for a gallery (e.g. a hero must keep one) */
  min?: number;
  hint?: { zh: string; en: string };
}

export interface CmsSection {
  id: string;
  title: { zh: string; en: string };
  description?: { zh: string; en: string };
  /** message key prefixes whose texts belong to this section */
  include: string[];
  /** message key prefixes to leave out */
  exclude?: string[];
  images?: CmsImageField[];
  /** page on the website where this content appears (without locale) */
  previewPath?: string;
}

export interface CmsGroup {
  id: string;
  title: { zh: string; en: string };
  sections: CmsSection[];
}

const HERO_HINT = {
  zh: "建议横向大图，宽度 1600px 以上，JPG/PNG/WebP，单张不超过 10MB。多张图片会自动轮播。",
  en: "Large landscape image, 1600px+ wide, JPG/PNG/WebP, max 10MB each. Multiple images rotate automatically.",
};

const GALLERY_HINT = {
  zh: "可添加多张图片，显示在本模块下方；不需要图片时全部删除即可。",
  en: "Add any number of images shown below this block; remove all to show none.",
};

const PRODUCT_HINT = {
  zh: "建议透明背景或白底产品图（PNG），多张图片会自动轮播；第一张同时用于产品列表。",
  en: "Transparent or white-background product photo (PNG). Multiple images rotate; the first one is also used in the product list.",
};

function solutionSection(
  id: string,
  ns: string,
  zh: string,
  en: string,
  path: string,
): CmsSection {
  return {
    id,
    title: { zh, en },
    include: [ns],
    exclude: [`${ns}.hero.images`],
    images: [
      {
        key: `${ns}.hero.images`,
        label: { zh: "首屏图片", en: "Hero images" },
        kind: "gallery",
        min: 1,
        hint: HERO_HINT,
      },
    ],
    previewPath: path,
  };
}

function productSection(
  id: string,
  ns: string,
  zh: string,
  en: string,
  path: string,
): CmsSection {
  return {
    id,
    title: { zh, en },
    include: [`products.${ns}`],
    exclude: [`products.${ns}.images`],
    images: [
      {
        key: `products.${ns}.images`,
        label: { zh: "产品图片", en: "Product images" },
        kind: "gallery",
        min: 1,
        hint: PRODUCT_HINT,
      },
    ],
    previewPath: path,
  };
}

export const CMS_GROUPS: CmsGroup[] = [
  {
    id: "home",
    title: { zh: "首页", en: "Home" },
    sections: [
      {
        id: "home-intro",
        title: { zh: "公司介绍", en: "Company introduction" },
        description: {
          zh: "首页顶部的公司介绍文字与大图。",
          en: "Company introduction text and image at the top of the home page.",
        },
        include: ["hero"],
        exclude: ["hero.images"],
        images: [
          {
            key: "hero.images",
            label: { zh: "公司介绍图片", en: "Introduction images" },
            kind: "gallery",
            min: 1,
            hint: HERO_HINT,
          },
        ],
        previewPath: "",
      },
      {
        id: "home-overview",
        title: { zh: "公司概况", en: "Company overview" },
        description: {
          zh: "首页「公司概况」模块及成立时间卡片。",
          en: "The company overview block and the founding-year card.",
        },
        include: [
          "company.overview",
          "company.established",
          "company.year",
          "company.establishedDescription",
        ],
        exclude: ["company.overview.images"],
        images: [
          {
            key: "company.overview.images",
            label: { zh: "公司概况图片", en: "Overview images" },
            kind: "gallery",
            min: 0,
            hint: GALLERY_HINT,
          },
        ],
        previewPath: "",
      },
      {
        id: "home-culture",
        title: { zh: "企业文化", en: "Corporate culture" },
        description: {
          zh: "首页「使命·愿景·价值观」模块。",
          en: "The mission, vision and values block on the home page.",
        },
        include: [
          "company.cultureLabel",
          "company.cultureTitle",
          "company.mission",
          "company.vision",
          "company.values",
        ],
        images: [
          {
            key: "company.cultureImages",
            label: { zh: "企业文化图片", en: "Culture images" },
            kind: "gallery",
            min: 0,
            hint: GALLERY_HINT,
          },
        ],
        previewPath: "",
      },
      {
        id: "home-about-page",
        title: { zh: "关于我们页面", en: "About page" },
        description: {
          zh: "「关于我们」页面的标题、核心技术能力和底部引导区。",
          en: "Title, core capabilities and call-to-action of the About page.",
        },
        include: [
          "company.hero",
          "company.capabilityTitle",
          "company.capabilities",
          "company.cta",
        ],
        previewPath: "/company",
      },
      {
        id: "home-technology-page",
        title: { zh: "核心技术页面", en: "Technology page" },
        include: ["technology"],
        previewPath: "/company/technology",
      },
    ],
  },
  {
    id: "products",
    title: { zh: "产品", en: "Products" },
    sections: [
      {
        id: "products-list",
        title: { zh: "产品中心", en: "Product center" },
        description: {
          zh: "产品列表页面的标题与介绍。各产品的名称、图片请在对应产品中修改。",
          en: "Heading of the product list page. Edit each product's name and images in its own section.",
        },
        include: [
          "products.label",
          "products.title",
          "products.description",
          "products.explore",
        ],
        previewPath: "/products",
      },
      productSection("product-sentinel", "sentinel", "360 Sentinel（360哨兵）", "360 Sentinel", "/products/360-sentinel"),
      productSection("product-dome", "dome", "Dome Watch（云瞰）", "Dome Watch", "/products/dome-watch"),
      productSection("product-guardian", "guardian", "Wide-area Guardian（广域卫士）", "Wide-area Guardian", "/products/wide-area-guardian"),
    ],
  },
  {
    id: "solutions",
    title: { zh: "解决方案", en: "Solutions" },
    sections: [
      {
        id: "solutions-overview",
        title: { zh: "解决方案总览", en: "Solutions overview" },
        description: {
          zh: "解决方案列表页面：标题、各方案卡片文字与卡片图片、架构图。",
          en: "Solutions list page: heading, solution cards and their images, architecture diagram.",
        },
        include: ["solutions"],
        exclude: [
          "solutions.items.urban.image",
          "solutions.items.transportation.image",
          "solutions.items.campus.image",
          "solutions.items.healthcare.image",
          "solutions.items.security.image",
          "solutions.items.industrial.image",
          "solutions.architecture.image",
        ],
        images: [
          { key: "solutions.items.urban.image", label: { zh: "卡片图片 · 城市公共空间", en: "Card image · Urban public spaces" }, kind: "single" },
          { key: "solutions.items.transportation.image", label: { zh: "卡片图片 · 交通枢纽", en: "Card image · Transportation hubs" }, kind: "single" },
          { key: "solutions.items.campus.image", label: { zh: "卡片图片 · 校园", en: "Card image · Campuses" }, kind: "single" },
          { key: "solutions.items.healthcare.image", label: { zh: "卡片图片 · 医疗健康", en: "Card image · Healthcare" }, kind: "single" },
          { key: "solutions.items.security.image", label: { zh: "卡片图片 · 高安全场所", en: "Card image · High-security" }, kind: "single" },
          { key: "solutions.items.industrial.image", label: { zh: "卡片图片 · 工业场景", en: "Card image · Industrial" }, kind: "single" },
          { key: "solutions.architecture.image", label: { zh: "智能感知架构图", en: "Architecture diagram" }, kind: "single" },
        ],
        previewPath: "/solutions",
      },
      solutionSection("solution-urban", "urbanPublicSpaces", "城市公共空间", "Urban public spaces", "/solutions/urban-public-spaces"),
      solutionSection("solution-transportation", "transportation", "交通枢纽与关键场所", "Transportation hubs", "/solutions/transportation-hubs-critical-sites"),
      solutionSection("solution-campuses", "campuses", "校园与教育机构", "Campuses", "/solutions/campuses-educational-institutions"),
      solutionSection("solution-healthcare", "healthcare", "医疗与养老机构", "Healthcare & senior care", "/solutions/healthcare-senior-care"),
      solutionSection("solution-security", "highSecurity", "高安全场所", "High-security facilities", "/solutions/high-security-facilities"),
      solutionSection("solution-industrial", "industrial", "商业与工业作业场景", "Commercial & industrial", "/solutions/commercial-industrial-worksites"),
    ],
  },
  {
    id: "support",
    title: { zh: "技术支持", en: "Support" },
    sections: [
      {
        id: "support-page",
        title: { zh: "技术支持页面", en: "Support page" },
        description: {
          zh: "知识中心页面：标题、常见问题、资料下载等全部文字与首屏图片。",
          en: "Knowledge center: heading, FAQ, downloads and the hero image.",
        },
        include: ["support"],
        exclude: ["support.hero.images"],
        images: [
          {
            key: "support.hero.images",
            label: { zh: "首屏图片", en: "Hero images" },
            kind: "gallery",
            min: 1,
            hint: HERO_HINT,
          },
        ],
        previewPath: "/support",
      },
    ],
  },
  {
    id: "contact",
    title: { zh: "联系我们", en: "Contact" },
    sections: [
      {
        id: "contact-info",
        title: { zh: "联系方式", en: "Contact details" },
        description: {
          zh: "电话、邮箱、地址。同时显示在「联系我们」页面和网站底部。",
          en: "Phone, email and address — shown on the contact page and in the footer.",
        },
        include: ["contact.info"],
        previewPath: "/contact",
      },
      {
        id: "contact-page",
        title: { zh: "联系我们页面", en: "Contact page" },
        description: {
          zh: "联系页面的标题、优势介绍、表单文字与提示信息。",
          en: "Contact page heading, benefits, form labels and messages.",
        },
        include: ["contact"],
        exclude: ["contact.info"],
        previewPath: "/contact",
      },
      {
        id: "site-footer",
        title: { zh: "网站底部", en: "Footer" },
        description: {
          zh: "网站底部的简介、栏目名称、版权信息与微信二维码。",
          en: "Footer description, column titles, copyright and WeChat QR code.",
        },
        include: ["footer"],
        exclude: ["footer.wechatQr"],
        images: [
          {
            key: "footer.wechatQr",
            label: { zh: "微信二维码", en: "WeChat QR code" },
            kind: "single",
            hint: {
              zh: "正方形二维码图片，建议 400×400 像素以上。",
              en: "Square QR code image, 400×400px or larger.",
            },
          },
        ],
        previewPath: "",
      },
      {
        id: "site-nav",
        title: { zh: "导航菜单", en: "Navigation menu" },
        include: ["nav"],
        previewPath: "",
      },
    ],
  },
];

export function findSection(id: string): CmsSection | undefined {
  for (const group of CMS_GROUPS) {
    const found = group.sections.find((s) => s.id === id);
    if (found) return found;
  }
  return undefined;
}

export function allImageKeys(): Set<string> {
  const keys = new Set<string>();
  for (const group of CMS_GROUPS) {
    for (const section of group.sections) {
      for (const image of section.images ?? []) keys.add(image.key);
    }
  }
  return keys;
}
