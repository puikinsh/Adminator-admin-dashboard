# Adminator Documentation

This directory contains the complete documentation for Adminator Bootstrap 5 Admin Template.

## 📁 Documentation Structure

```
docs/
├── index.md                 # Homepage
├── _config.yml              # GitHub Pages configuration
├── getting-started/         # Installation and setup guides
│   ├── installation.md
│   ├── project-structure.md
│   ├── development.md
│   └── build-deployment.md
├── components/              # Component documentation
│   ├── charts.md
│   ├── forms.md
│   ├── tables.md
│   ├── navigation.md
│   └── modals.md
├── customization/           # Theme and styling guides
│   ├── theme-system.md
│   ├── css-variables.md
│   ├── custom-themes.md
│   └── component-theming.md
├── api/                     # API reference
│   ├── theme-api.md
│   ├── component-apis.md
│   ├── utilities.md
│   └── events.md
├── examples/                # Practical examples
│   ├── basic-setup.md
│   ├── custom-components.md
│   ├── theme-integration.md
│   └── advanced-patterns.md
├── deployment/              # Production deployment
│   ├── production-build.md
│   ├── static-hosting.md
│   ├── cdn-integration.md
│   └── performance.md
└── contributing/            # Contribution guidelines
    ├── development-setup.md
    ├── code-standards.md
    ├── pull-requests.md
    └── issues.md
```

## 🚀 Hosting Strategy

### **GitHub Pages Setup**

1. **Main Branch Integration**: Documentation lives in the `docs/` folder of the main branch
2. **Automatic Deployment**: GitHub Pages automatically builds and deploys on every commit
3. **Custom Domain Support**: Can be configured with custom domains
4. **Jekyll Integration**: Uses Jekyll static site generator with the Minima theme

### **Benefits of This Approach**

✅ **Version Control**: Docs stay in sync with code releases  
✅ **Free Hosting**: GitHub Pages provides free, reliable hosting  
✅ **Easy Discovery**: Users find docs directly in the repository  
✅ **SEO Friendly**: Searchable and indexable documentation  
✅ **Collaboration**: Easy for contributors to update docs  
✅ **Professional URLs**: Clean URLs like `username.github.io/repo/`

## 📖 Documentation Sections

### **🏁 Getting Started**
Complete setup and installation guides for new users.

### **🎨 Components** 
Detailed documentation for all UI components and their usage.

### **🌙 Dark Mode & Theming**
Comprehensive guide to the theme system and customization options.

### **🔧 API Reference**
Complete API documentation for all JavaScript utilities and components.

### **💡 Examples**
Practical, copy-paste examples for common use cases.

### **🚀 Deployment**
Production deployment guides and performance optimization tips.

### **🤝 Contributing**
Guidelines for contributing to the project.

## 🔧 Local Development

To view the documentation locally:

```bash
# Install Jekyll (if not already installed)
gem install bundler jekyll

# Navigate to docs directory
cd docs

# Install dependencies
bundle install

# Serve locally
bundle exec jekyll serve

# Visit http://localhost:4000
```

## 📝 Writing Documentation

### **Markdown Guidelines**

- Use clear, descriptive headings
- Include code examples for all features
- Add cross-references between related sections
- Use emoji for visual appeal (sparingly)
- Include "Next Steps" sections to guide readers

### **Code Examples**

```markdown
\```javascript
// Always include working code examples
const example = Theme.current();
console.log(example);
\```
```

### **File Naming**

- Use lowercase with hyphens: `theme-system.md`
- Be descriptive but concise
- Group related files in subdirectories

## 🔗 Quick Links

- **[Live Documentation](https://puikinsh.github.io/Adminator-admin-dashboard/)** (Coming Soon)
- **[GitHub Repository](https://github.com/puikinsh/Adminator-admin-dashboard)**
- **[Live Demo](https://colorlib.com/polygon/adminator/index.html)**

## 📞 Support

For documentation issues:
- Open an issue with the `documentation` label
- Suggest improvements via pull requests
- Join discussions for larger documentation changes

---

**Happy documenting!** 📚 