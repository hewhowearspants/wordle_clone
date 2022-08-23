export function copyToClipboard(text, callback = () => {}) {
  navigator.clipboard.writeText(text).then(function() {
    callback();
  }, function(err) {
    alert(text);
  });
}