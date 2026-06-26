const fs = require('fs');
const path = require('path');

class ViewController {
  // Phục vụ giao diện chính SPA của ứng dụng được lắp ghép động từ các partials
  static renderHome(req, res) {
    try {
      const layoutPath = path.join(__dirname, '../views/layouts/main.html');
      let html = fs.readFileSync(layoutPath, 'utf8');

      const partials = [
        'welcome', 'header', 'nav', 'dashboard', 'lesson_select',
        'quiz', 'formula', 'game_menu', 'game_rocket', 'game_business',
        'game_geogebra', 'achievements', 'modals'
      ];

      partials.forEach(partial => {
        const partialPath = path.join(__dirname, `../views/partials/${partial}.html`);
        const content = fs.readFileSync(partialPath, 'utf8');
        html = html.replace(`{{${partial}}}`, content);
      });

      res.send(html);
    } catch (error) {
      console.error('Lỗi khi tải hoặc lắp ghép giao diện:', error);
      res.status(500).send('Lỗi hệ thống khi tải giao diện học tập.');
    }
  }
}

module.exports = ViewController;
