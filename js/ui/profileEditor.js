import { localization } from '../core/localization.js';
import { AVATARS } from '../core/constants.js';

export function createProfileEditor(currentProfile, onSave, onCancel) {
  const container = document.createElement('div');
  container.className = 'profile-editor';

  const title = document.createElement('h3');
  title.textContent = localization.t('profile.editProfile');
  container.appendChild(title);

  // Username
  const nameLabel = document.createElement('label');
  nameLabel.textContent = localization.t('profile.username');
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.className = 'profile-input';
  nameInput.value = currentProfile.username || '';
  nameInput.maxLength = 30;
  container.appendChild(nameLabel);
  container.appendChild(nameInput);

  // Avatar
  const avatarLabel = document.createElement('label');
  avatarLabel.textContent = localization.t('profile.avatar');
  container.appendChild(avatarLabel);
  const avatarGrid = document.createElement('div');
  avatarGrid.className = 'avatar-grid';
  AVATARS.forEach(av => {
    const opt = document.createElement('span');
    opt.className = `avatar-option${currentProfile.avatar === av ? ' selected' : ''}`;
    opt.textContent = av;
    opt.addEventListener('click', () => {
      avatarGrid.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('selected'));
      opt.classList.add('selected');
      avatarGrid.dataset.selected = av;
    });
    avatarGrid.appendChild(opt);
  });
  avatarGrid.dataset.selected = currentProfile.avatar || AVATARS[0];
  container.appendChild(avatarGrid);

  // Buttons
  const btnRow = document.createElement('div');
  btnRow.className = 'profile-editor-buttons';
  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn btn-primary';
  saveBtn.textContent = localization.t('profile.save');
  saveBtn.addEventListener('click', () => {
    const username = nameInput.value.trim();
    if (!username) { alert(localization.t('profile.usernameRequired')); return; }
    onSave({ username, avatar: avatarGrid.dataset.selected });
  });
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn-secondary';
  cancelBtn.textContent = localization.t('profile.cancel');
  cancelBtn.addEventListener('click', onCancel);
  btnRow.appendChild(saveBtn);
  btnRow.appendChild(cancelBtn);
  container.appendChild(btnRow);

  return container;
}