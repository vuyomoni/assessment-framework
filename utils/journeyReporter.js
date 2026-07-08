// Journey Reporter
class JourneyReporter {
  constructor(journeyName, userProfile) {
    this.journeyName = journeyName;
    this.userProfile = userProfile;
    this.steps = [];
    this.startedAt = Date.now();
  }

  recordStep(stepName, status, observation = '') {
    this.steps.push({
      stepName,
      status,
      observation
    });
  }

  getLastSuccessfulStep() {
    const successfulSteps = this.steps.filter((step) => step.status === 'PASSED');
    if (successfulSteps.length === 0) {
      return 'None';
    }

    return successfulSteps[successfulSteps.length - 1].stepName;
  }

  getFirstFailure() {
    return this.steps.find((step) => step.status === 'FAILED') || null;
  }

  getSummary() {
    const firstFailure = this.getFirstFailure();

    return {
      journeyName: this.journeyName,
      user: this.userProfile.username,
      profile: this.userProfile.key,
      durationMs: Date.now() - this.startedAt,
      status: firstFailure ? 'FAILED' : 'PASSED',
      lastSuccessfulStep: this.getLastSuccessfulStep(),
      failureStage: firstFailure ? firstFailure.stepName : 'None',
      observation: firstFailure ? firstFailure.observation : 'Journey completed successfully'
    };
  }
}

module.exports = { JourneyReporter };
