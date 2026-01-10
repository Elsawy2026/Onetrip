# Chat Saving Feature Guide - OneTrip Express

## دليل ميزة حفظ المحادثات - OneTrip Express

### Overview | نظرة عامة

The OneTrip Express website now includes a **Chat Saving System** that allows users to save and export their chat conversations with the AI assistant.

يحتوي موقع OneTrip Express الآن على **نظام حفظ المحادثات** الذي يسمح للمستخدمين بحفظ وتصدير محادثاتهم مع المساعد الذكي.

---

## Features | المميزات

✅ **Automatic Saving**: All chat messages are automatically saved to browser localStorage  
✅ **Export Options**: Export chats as JSON or Text files  
✅ **Clear History**: Option to clear saved chat history  
✅ **Statistics**: View number of saved messages  
✅ **Bilingual Support**: Works in both Arabic and English

✅ **حفظ تلقائي**: جميع رسائل المحادثة تُحفظ تلقائياً في localStorage المتصفح  
✅ **خيارات التصدير**: تصدير المحادثات كملفات JSON أو نص  
✅ **حذف المحفوظات**: خيار لحذف تاريخ المحادثات المحفوظة  
✅ **الإحصائيات**: عرض عدد الرسائل المحفوظة  
✅ **دعم ثنائي اللغة**: يعمل بالعربية والإنجليزية

---

## How to Use | كيفية الاستخدام

### 1. Saving Chats | حفظ المحادثات

- **Automatic**: All messages are saved automatically when sent or received
- **Manual**: No manual saving needed - it's automatic!

- **تلقائي**: جميع الرسائل تُحفظ تلقائياً عند الإرسال أو الاستقبال  
- **يدوي**: لا حاجة للحفظ اليدوي - يتم تلقائياً!

### 2. Accessing Save Menu | الوصول لقائمة الحفظ

1. Open the chat widget by clicking the chat button
2. Click the **Download button** (⬇️) in the chat header
3. A menu will appear with export options

1. افتح نافذة المحادثة بالنقر على زر المحادثة
2. انقر على **زر التحميل** (⬇️) في رأس المحادثة
3. ستظهر قائمة بخيارات التصدير

### 3. Export Options | خيارات التصدير

#### Export as JSON | تصدير كـ JSON
- Saves chat in JSON format
- Includes all metadata (timestamp, sender, text)
- Best for programmatic processing
- File name: `onetrip_chat_YYYY-MM-DD.json`

- يحفظ المحادثة بصيغة JSON
- يتضمن جميع البيانات الوصفية (الوقت، المرسل، النص)
- الأفضل للمعالجة البرمجية
- اسم الملف: `onetrip_chat_YYYY-MM-DD.json`

#### Export as Text | تصدير كـ نص
- Saves chat as readable text file
- Includes formatted messages with dates/times
- Best for reading and sharing
- File name: `onetrip_chat_YYYY-MM-DD.txt`

- يحفظ المحادثة كملف نصي قابل للقراءة
- يتضمن رسائل منسقة مع التاريخ والوقت
- الأفضل للقراءة والمشاركة
- اسم الملف: `onetrip_chat_YYYY-MM-DD.txt`

### 4. Clear History | حذف المحفوظات

1. Open the save menu (click download button)
2. Click "حذف المحفوظات" (Clear History)
3. Confirm deletion
4. All saved chats will be permanently deleted

1. افتح قائمة الحفظ (انقر على زر التحميل)
2. انقر على "حذف المحفوظات"
3. أكد الحذف
4. سيتم حذف جميع المحادثات المحفوظة نهائياً

### 5. View Statistics | عرض الإحصائيات

1. Open the save menu
2. Click "عرض الإحصائيات" (View Stats)
3. See the number of saved messages

1. افتح قائمة الحفظ
2. انقر على "عرض الإحصائيات"
3. شاهد عدد الرسائل المحفوظة

---

## Technical Details | التفاصيل التقنية

### Storage | التخزين

- **Location**: Browser localStorage
- **Key**: `onetrip_chat_history`
- **Max Messages**: 1000 messages (auto-truncated)
- **Format**: JSON array of message objects

- **الموقع**: localStorage المتصفح
- **المفتاح**: `onetrip_chat_history`
- **الحد الأقصى**: 1000 رسالة (يتم الحذف التلقائي)
- **الصيغة**: مصفوفة JSON من كائنات الرسائل

### Message Object Structure | هيكل كائن الرسالة

```json
{
  "text": "Message content",
  "sender": "user" | "bot",
  "timestamp": "2026-01-10T12:30:00.000Z",
  "date": "10/01/2026",
  "time": "12:30 PM"
}
```

### Exported JSON Format | صيغة JSON المُصدّرة

```json
[
  {
    "text": "Hello",
    "sender": "user",
    "timestamp": "2026-01-10T12:30:00.000Z",
    "date": "10/01/2026",
    "time": "12:30 PM"
  },
  {
    "text": "Welcome to OneTrip!",
    "sender": "bot",
    "timestamp": "2026-01-10T12:30:05.000Z",
    "date": "10/01/2026",
    "time": "12:30 PM"
  }
]
```

### Exported Text Format | صيغة النص المُصدّرة

```
=== تاريخ محادثة OneTrip ===
تاريخ التصدير: 10/01/2026 12:30:00 PM
عدد الرسائل: 2
==================================================

[1] المستخدم (10/01/2026 12:30 PM)
Hello
--------------------------------------------------

[2] المساعد (10/01/2026 12:30 PM)
Welcome to OneTrip!
--------------------------------------------------
```

---

## Browser Compatibility | توافق المتصفحات

✅ Chrome/Edge (Recommended)  
✅ Firefox  
✅ Safari  
✅ Opera  

⚠️ **Note**: localStorage requires JavaScript enabled

⚠️ **ملاحظة**: localStorage يتطلب تفعيل JavaScript

---

## Functions Available | الدوال المتاحة

### JavaScript Functions | دوال JavaScript

```javascript
// Get chat history
window.getChatHistory() // Returns array of messages

// Clear chat history
window.clearChatHistory() // Returns boolean

// Export as JSON
window.exportChatAsJSON() // Downloads JSON file

// Export as Text
window.exportChatAsText() // Downloads text file

// Show save menu
window.showChatSaveMenu(event) // Shows dropdown menu

// Hide save menu
window.hideChatSaveMenu() // Hides dropdown menu
```

---

## Privacy & Security | الخصوصية والأمان

🔒 **Local Storage Only**: All chats are stored locally in your browser  
🔒 **No Server Upload**: Chats are never sent to any server  
🔒 **User Control**: You can delete your chat history anytime  
🔒 **Browser Specific**: Chats are stored per browser/device

🔒 **التخزين المحلي فقط**: جميع المحادثات تُحفظ محلياً في متصفحك  
🔒 **لا رفع للسيرفر**: المحادثات لا تُرسل لأي سيرفر  
🔒 **التحكم الكامل**: يمكنك حذف تاريخ المحادثات في أي وقت  
🔒 **خاص بالمتصفح**: المحادثات تُحفظ لكل متصفح/جهاز

---

## Troubleshooting | حل المشاكل

### Chats not saving? | المحادثات لا تُحفظ؟

1. Check if JavaScript is enabled
2. Check browser console for errors
3. Check if localStorage is available: `typeof(Storage) !== "undefined"`
4. Clear browser cache and try again

1. تحقق من تفعيل JavaScript
2. تحقق من وحدة التحكم للمتصفح للأخطاء
3. تحقق من توفر localStorage: `typeof(Storage) !== "undefined"`
4. امسح ذاكرة التخزين المؤقت وجرب مرة أخرى

### Export not working? | التصدير لا يعمل؟

1. Check browser popup blocker settings
2. Allow downloads in browser settings
3. Check browser console for errors
4. Try a different browser

1. تحقق من إعدادات حظر النوافذ المنبثقة
2. اسمح بالتنزيلات في إعدادات المتصفح
3. تحقق من وحدة التحكم للأخطاء
4. جرب متصفحاً مختلفاً

### Can't find saved chats? | لا يمكن العثور على المحادثات المحفوظة؟

- Chats are saved in browser localStorage
- Different browsers/devices have separate storage
- Clearing browser data will delete saved chats
- Use export feature to backup your chats

- المحادثات محفوظة في localStorage المتصفح
- المتصفحات/الأجهزة المختلفة لها تخزين منفصل
- مسح بيانات المتصفح سيحذف المحادثات المحفوظة
- استخدم ميزة التصدير لنسخ احتياطي لمحادثاتك

---

## Support | الدعم

For technical support or questions:  
info@onetrip.sa | 920032104

للدعم الفني أو الأسئلة:  
info@onetrip.sa | 920032104

---

**Last Updated**: January 10, 2026  
**Version**: 1.0.0

**آخر تحديث**: 10 يناير 2026  
**الإصدار**: 1.0.0
