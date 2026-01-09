# AI Chat System Setup - One Trip Express

## نظام AI Chat - Stateless Session

تم إضافة نظام AI Chat بنظام **Stateless Session** - لا حفظ للمحادثات، لا Memory، كل محادثة مستقلة.

---

## ⚙️ الإعداد (Configuration)

### 1. إعداد AI API

#### الخيار 1: استخدام OpenAI API

1. افتح ملف `ai-chat-config.js`
2. قم بتحديث الإعدادات:

```javascript
window.AI_CHAT_CONFIG = {
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    apiKey: 'YOUR_OPENAI_API_KEY', // استبدل بـ API Key الخاص بك
    provider: 'openai',
    model: 'gpt-3.5-turbo', // أو 'gpt-4'
    temperature: 0.7,
    maxTokens: 500,
    stateless: true, // دائماً true
    clearOnClose: true,
    clearOnUnload: true,
    systemPrompt: `...` // System Prompt موجود بالفعل
};
```

3. قم بفتح ملف `index.html` وفعّل السطر:

```html
<script src="ai-chat-config.js"></script>
```

#### الخيار 2: استخدام Anthropic Claude API

```javascript
window.AI_CHAT_CONFIG = {
    apiUrl: 'https://api.anthropic.com/v1/messages',
    apiKey: 'YOUR_ANTHROPIC_API_KEY',
    provider: 'anthropic',
    model: 'claude-3-sonnet-20240229',
    temperature: 0.7,
    maxTokens: 500,
    stateless: true,
    clearOnClose: true,
    clearOnUnload: true,
    systemPrompt: `...`
};
```

#### الخيار 3: استخدام Custom API (خاص بك)

```javascript
window.AI_CHAT_CONFIG = {
    apiUrl: 'YOUR_CUSTOM_API_ENDPOINT',
    apiKey: 'YOUR_API_KEY',
    provider: 'custom',
    model: 'your-model',
    temperature: 0.7,
    maxTokens: 500,
    stateless: true,
    clearOnClose: true,
    clearOnUnload: true,
    systemPrompt: `...`
};
```

**ملاحظة:** Custom API يجب أن يقبل JSON في الشكل التالي:

```json
{
    "system_prompt": "...",
    "user_message": "...",
    "stateless": true,
    "temperature": 0.7,
    "max_tokens": 500
}
```

ويجب أن يُرجع JSON في الشكل:

```json
{
    "response": "...",
    // أو
    "message": "...",
    // أو
    "text": "..."
}
```

---

### 2. الأمان (Security)

⚠️ **مهم جداً:** لا تقم برفع ملف `ai-chat-config.js` الذي يحتوي على API Key إلى GitHub!

1. أضف `ai-chat-config.js` إلى `.gitignore`:

```gitignore
# AI Chat Configuration (contains API keys)
ai-chat-config.js
```

2. استخدم Environment Variables في Production بدلاً من ملف JavaScript.

---

## 🔄 النظام Stateless - كيف يعمل؟

### 1. لا حفظ للمحادثات
- لا يتم استخدام `localStorage`
- لا يتم استخدام `sessionStorage`
- لا يتم استخدام `Cookies`
- لا يتم استخدام `Database`

### 2. System Prompt يُرسل مع كل رسالة
- كل رسالة جديدة ترسل مع System Prompt كامل
- لا يوجد Memory أو Context من الرسائل السابقة
- كل محادثة مستقلة تماماً

### 3. حذف تلقائي عند الإغلاق
- عند إغلاق Chat Widget → يتم حذف كل المحادثة
- عند إغلاق الصفحة → يتم حذف كل المحادثة
- عند تحديث الصفحة → يتم حذف كل المحادثة

---

## 📝 System Prompt

System Prompt الافتراضي موجود في `scripts.js` ويحتوي على:

- نبذة الشركة
- الخدمات
- الشركاء
- الفروع
- بيانات التواصل
- أسلوب الرد
- اللغة (عربي/إنجليزي)

يمكنك تعديل System Prompt في `ai-chat-config.js` أو `scripts.js`.

---

## 🎨 الواجهة (UI)

### Typing Indicator
- يتم عرض مؤشر الكتابة أثناء انتظار الرد من AI
- يتم إزالته تلقائياً عند وصول الرد

### Fallback System
- في حالة عدم توفر AI API أو حدوث خطأ
- يتم استخدام النظام Rule-based الموجود مسبقاً

---

## 🧪 الاختبار (Testing)

### 1. اختبار بدون API (Fallback)
- النظام يعمل تلقائياً باستخدام Rule-based
- لا يحتاج إعداد

### 2. اختبار مع OpenAI API
1. احصل على OpenAI API Key من: https://platform.openai.com/api-keys
2. حدّث `ai-chat-config.js` بـ API Key
3. فعّل `ai-chat-config.js` في `index.html`
4. افتح Chat Widget وجرب محادثة

### 3. اختبار Stateless Session
1. افتح Chat Widget
2. أرسل رسالة
3. أغلق Chat Widget
4. افتح Chat Widget مرة أخرى
5. يجب أن تظهر رسالة الترحيب فقط (بدون الرسائل السابقة)

---

## 📚 الكود المهم

### `scripts.js`
- `callAIChatAPI()` - استدعاء AI API
- `handleUserMessage()` - معالجة رسائل المستخدم
- `resetChatConversation()` - حذف المحادثة
- `showTypingIndicator()` - عرض مؤشر الكتابة
- `AI_SYSTEM_PROMPT` - System Prompt

### `styles.css`
- `.typing-indicator` - نمط مؤشر الكتابة
- `.typing-dots` - نقاط الكتابة المتحركة
- `@keyframes typingDot` - حركة النقاط

### `ai-chat-config.js`
- إعدادات AI API
- System Prompt (اختياري)

---

## ✅ التحقق من النظام Stateless

تأكد من:
1. ✅ لا يوجد `localStorage.setItem()` في الكود
2. ✅ لا يوجد `sessionStorage.setItem()` في الكود
3. ✅ لا يوجد `Cookies` في الكود
4. ✅ System Prompt يُرسل مع كل رسالة
5. ✅ المحادثة تُحذف عند إغلاق Widget
6. ✅ المحادثة تُحذف عند إغلاق الصفحة

---

## 🔗 روابط مفيدة

- OpenAI API: https://platform.openai.com/docs
- Anthropic Claude API: https://docs.anthropic.com/
- System Prompt Best Practices: https://platform.openai.com/docs/guides/prompt-engineering

---

## 📞 الدعم

في حالة وجود مشاكل أو أسئلة، راجع الكود في `scripts.js` أو تواصل مع فريق التطوير.

---

**تم التطوير بواسطة:** Cursor AI Assistant  
**التاريخ:** 2026-01-09  
**النسخة:** 1.0.0
