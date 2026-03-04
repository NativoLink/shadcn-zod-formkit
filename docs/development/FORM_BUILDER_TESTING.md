# 🎨 Form Builder - Testing Guide

## ✅ Status: READY TO TEST (with Preview!)

The Form Builder prototype is now complete with a live preview feature!

---

## 🚀 How to Test

### 1. Start the Development Server

```bash
cd example
npm run dev
```

### 2. Access the Form Builder

Open your browser and navigate to:
- **Main Examples**: http://localhost:3000
- **Form Builder**: http://localhost:3000/form-builder

Or click the "🎨 Open Form Builder" button on the main page.

---

## 🎯 Features to Test

### 🎨 Builder Tab

#### ✨ Drag & Drop
- [ ] Drag input types from the left palette to the canvas
- [ ] Reorder fields by dragging them up/down
- [ ] Visual feedback when dragging (opacity, hover states)

#### ⚙️ Properties Panel
- [ ] Click on a field to select it
- [ ] Edit basic properties (name, label, placeholder, description)
- [ ] Toggle switches (required, disabled)
- [ ] Edit input-specific properties:
  - **Rating**: Max stars, Show value
  - **Phone**: Default country code
  - **Password**: Show strength, Show requirements
  - **URL**: Show preview, Auto protocol

#### 🛠️ Toolbar Actions
- [ ] **Export**: Download form configuration as JSON
- [ ] **Import**: Upload a JSON file to load a form
- [ ] **Clear**: Remove all fields (with confirmation)
- [ ] Field counter updates correctly

#### 🎨 Field Actions
- [ ] **Select**: Click to select and edit properties
- [ ] **Duplicate**: Copy a field with all its properties
- [ ] **Delete**: Remove a field from the canvas

### 👁️ Preview Tab (NEW!)

#### Live Form Preview
- [ ] Switch to Preview tab to see the rendered form
- [ ] Form updates instantly when you make changes in Builder
- [ ] All fields render correctly with their configurations
- [ ] Fill out the form and test inputs

#### Form Data Display
- [ ] Submit the form to see captured data
- [ ] Data displays in JSON format
- [ ] All field values are captured correctly

#### Configuration Display
- [ ] View the complete JSON configuration
- [ ] Field count is displayed correctly
- [ ] JSON is properly formatted and readable

---

## 📋 Test Scenarios

### Scenario 1: Build and Preview
1. Go to Builder tab
2. Drag a "Text" input to canvas
3. Edit its properties (name: "username", label: "Username")
4. Switch to Preview tab
5. See the field rendered
6. Fill it out and submit
7. Verify data appears in the output

### Scenario 2: Real-time Updates
1. In Builder, add a "Rating" input
2. Switch to Preview - see it appear
3. Switch back to Builder
4. Change the label to "Rate Us"
5. Switch to Preview - see the label updated

### Scenario 3: Complex Form Testing
1. Build a form with 5+ different input types
2. Configure various properties (required, descriptions, etc.)
3. Switch to Preview
4. Test all inputs work correctly
5. Submit and verify all data is captured

### Scenario 4: Import and Preview
1. Import a JSON configuration
2. Switch to Preview immediately
3. Test the imported form
4. Make adjustments in Builder
5. See changes reflected in Preview

---

## 🐛 Known Limitations

This is a **prototype** (Phase 1 MVP), so some features are not yet implemented:

- ❌ No live preview modal
- ❌ No undo/redo
- ❌ No field grouping (rows/columns)
- ❌ No templates
- ❌ No validation rules editor
- ❌ No conditional display editor
- ❌ Limited input types (14 available)

---

## 📊 Available Input Types

The following input types are available in the palette:

1. 📝 Text
2. 🔢 Number
3. 📱 Phone
4. 🔗 URL
5. 🔒 Password
6. ⭐ Rating
7. 🎨 Color
8. 📅 Date
9. ⏰ Time
10. 📋 Select
11. ☑️ Checkbox
12. 🔄 Switch
13. 🎯 Slider
14. 📄 Textarea

---

## 💡 Tips

- **Drag Handle**: Use the grip icon (⋮⋮) to drag fields
- **Quick Select**: Click anywhere on a field card to select it
- **Keyboard**: Use Tab to navigate between property inputs
- **JSON Format**: Exported JSON is compatible with DynamicForm component

---

## 🔧 Troubleshooting

### Form Builder doesn't load
- Check console for errors
- Verify you're in the `example` directory
- Run `npm install` if dependencies are missing

### Drag & Drop not working
- Make sure you're dragging from the grip icon
- Try refreshing the page
- Check browser console for errors

### Properties not saving
- Properties save automatically on change
- Check if the field is selected (blue ring)
- Verify the property is supported for that input type

---

## 📤 Example Export

Here's what an exported form looks like:

```json
[
  {
    "name": "username",
    "label": "Username",
    "inputType": "text_group",
    "placeHolder": "Enter your username",
    "description": "Choose a unique username",
    "required": true,
    "zodType": {}
  },
  {
    "name": "rating",
    "label": "Rate Your Experience",
    "inputType": "rating",
    "max": 5,
    "showValue": true,
    "zodType": {}
  }
]
```

---

## 🎉 Next Steps

After testing, you can:

1. Use the exported JSON with `DynamicForm` component
2. Customize the Form Builder UI
3. Add more input types
4. Implement advanced features (preview, templates, etc.)

---

## 📝 Feedback

Please report any issues or suggestions:
- What works well?
- What's confusing?
- What features are most important?
- Any bugs or unexpected behavior?

---

**Happy Building! 🚀**
