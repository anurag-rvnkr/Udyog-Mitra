const { test, expect } = require('@playwright/test');

test('candidate completes onboarding and saves and exports an approved resume', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'New to CareerOS? Create an account' }).click();
  await page.locator('#authEmail').fill(`browser-demo-${Date.now()}@example.com`);
  await page.locator('#authPassword').fill('careerOS-browser-pass-2026');
  await page.getByRole('button', { name: 'Create account' }).click();

  await expect(page.locator('#profileOnboardingGate')).toBeVisible();
  await page.locator('#onboardName').fill('Browser Candidate');
  await page.locator('#onboardStage').selectOption({ label: 'Early career' });
  await page.locator('#onboardEducation').fill('BSc Computer Science');
  await page.locator('#onboardGradYear').fill('2026');
  await page.locator('#onboardRoles').fill('Data Analyst');
  await page.locator('#onboardSkills').fill('SQL, Python, reporting');
  await page.locator('#onboardLocation').fill('Remote');
  await page.locator('#completeOnboarding').click();
  await expect(page.locator('#profileOnboardingGate')).toBeHidden();

  await page.locator('[data-view="intelligence"]').first().click();
  await page.locator('#analysisRole').fill('Data Analyst');
  await page.locator('#analysisJD').fill('SQL and Python data analyst role with reporting and dashboard experience.');
  await page.locator('#resumeText').fill('Built SQL reports.\nEXPERIENCE\nCreated a Python dashboard for café inventory.\nEDUCATION\nBSc Computer Science');
  await page.locator('#runAnalysis').click();
  await expect(page.locator('#analysisResult')).toContainText('Evidence map');
  await expect(page.locator('#resumeReviewPanel')).toContainText('Requirement evidence review');

  await page.locator('#saveResumeReview').click();
  await expect(page.locator('#saveResumeReview')).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Generate suggestions' })).toBeVisible();
  await page.getByRole('button', { name: 'Generate suggestions' }).click();
  await expect(page.locator('[data-proposed]').first()).toBeVisible();

  await page.locator('[data-proposed]').first().fill('Created SQL reports for internal analysis.');
  await page.locator('[data-edit-decision]').first().selectOption('accept');
  await page.locator('[data-edit-confirm]').first().check();
  await page.locator('#saveApprovedResume').click();
  await expect(page.locator('#finalResumePreview')).toHaveValue(/Created SQL reports for internal analysis/);
  await expect(page.locator('#exportResumeDocx')).toBeEnabled();
  await expect(page.locator('#exportResumePdf')).toBeEnabled();
  await expect(page.locator('#exportResumeTxt')).toBeEnabled();

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#exportResumePdf').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  expect(download.suggestedFilename()).not.toContain('..');

  await page.reload();
  await page.locator('[data-view="intelligence"]').first().click();
  await expect(page.locator('#resumeReviewHistory')).toContainText('Data Analyst');

  await page.setViewportSize({ width: 390, height: 844 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('protected APIs reject anonymous access and logout revokes the current session', async ({ page, request }) => {
  const protectedResponse = await request.get('/api/applications');
  expect(protectedResponse.status()).toBe(401);

  await page.goto('/');
  await page.getByRole('button', { name: 'New to CareerOS? Create an account' }).click();
  await page.locator('#authEmail').fill(`browser-security-${Date.now()}@example.com`);
  await page.locator('#authPassword').fill('careerOS-browser-pass-2026');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.locator('#profileOnboardingGate')).toBeVisible();

  await page.locator('#onboardName').fill('Demo Candidate');
  await page.locator('#onboardStage').selectOption({ label: 'Early career' });
  await page.locator('#onboardEducation').fill('Not applicable');
  await page.locator('#onboardGradYear').fill('Not applicable');
  await page.locator('#onboardRoles').fill('QA Engineer');
  await page.locator('#onboardSkills').fill('Testing, SQL');
  await page.locator('#completeOnboarding').click();
  await expect(page.locator('#profileOnboardingGate')).toBeHidden();

  page.once('dialog', dialog => dialog.accept());
  await page.locator('#settingsBtn').click();
  await expect(page.locator('#authGate')).toBeVisible();
});
