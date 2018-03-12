export function fullName(profile) {
  if (!profile) {
    return '';
  }

  return `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.username || '';
}