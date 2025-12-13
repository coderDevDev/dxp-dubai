# Configuration Guide

## Logo Position Setting

You can now control the position of your logo in the header using the `config.json` file.

### Usage

Open `config.json` and modify the `header.logo.position` value:

```json
{
  "header": {
    "logo": {
      "position": "left",
      "description": "Logo position in header: 'left', 'center', or 'right'",
      "options": ["left", "center", "right"]
    }
  }
}
```

### Available Options

| Position | Description | Menu Button Position |
|----------|-------------|---------------------|
| `"left"` | Logo aligned to the left | Menu button on the right |
| `"center"` | Logo centered | Menu button on the right side |
| `"right"` | Logo aligned to the right | Menu button on the left side |

### Examples

**Left-aligned logo (default):**
```json
"position": "left"
```

**Centered logo:**
```json
"position": "center"
```

**Right-aligned logo:**
```json
"position": "right"
```

### How It Works

1. The configuration is loaded automatically when the page loads
2. The `site-config.js` script reads the `config.json` file
3. CSS classes are applied dynamically to position the logo
4. No page reload needed - just refresh the browser after changing config

### Notes

- The logo size remains responsive based on screen size (180px mobile → 280px desktop)
- The menu button automatically adjusts its position based on logo alignment
- Changes take effect immediately after page refresh
