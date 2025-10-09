import { defineField, defineType, defineArrayMember } from 'sanity'

export default defineType({
  name: 'workout',
  title: 'Workout',
  type: 'document',
  icon: () => '💪',
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID',
      description: 'The unique Clerk ID of the user who performed this workout',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Workout Date',
      description: 'The date when this workout was performed',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
      },
    }),
    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      description: 'Total duration of the workout in seconds',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'exercises',
      title: 'Exercises',
      description: 'List of exercises performed in this workout with their sets and repetitions',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'workoutExercise',
          title: 'Workout Exercise',
          fields: [
            defineField({
              name: 'exercise',
              title: 'Exercise',
              description: 'Reference to the exercise performed',
              type: 'reference',
              to: [{ type: 'exercise' }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'sets',
              title: 'Sets',
              description: 'List of sets performed for this exercise',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'set',
                  title: 'Set',
                  fields: [
                    defineField({
                      name: 'repetitions',
                      title: 'Repetitions',
                      description: 'Number of repetitions performed in this set',
                      type: 'number',
                      validation: (Rule) => Rule.required().min(1),
                    }),
                    defineField({
                      name: 'weight',
                      title: 'Weight',
                      description: 'Weight used for this set (optional for bodyweight exercises)',
                      type: 'number',
                      validation: (Rule) => Rule.min(0),
                      initialValue: 0,
                    }),
                    defineField({
                      name: 'weightUnit',
                      title: 'Weight Unit',
                      description: 'Unit of measurement for the weight',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Pounds (lbs)', value: 'lbs' },
                          { title: 'Kilograms (kg)', value: 'kg' },
                        ],
                        layout: 'radio',
                      },
                      initialValue: 'lbs',
                    }),
                  ],
                  preview: {
                    select: {
                      repetitions: 'repetitions',
                      weight: 'weight',
                      weightUnit: 'weightUnit',
                    },
                    prepare(selection) {
                      const { repetitions, weight, weightUnit } = selection
                      return {
                        title: `${repetitions} reps @ ${weight} ${weightUnit}`,
                      }
                    },
                  },
                }),
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              exerciseName: 'exercise.name',
              sets: 'sets',
            },
            prepare(selection) {
              const { exerciseName, sets } = selection
              const setCount = sets ? sets.length : 0
              return {
                title: exerciseName || 'Unknown Exercise',
                subtitle: `${setCount} set${setCount !== 1 ? 's' : ''}`,
              }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      date: 'date',
      duration: 'duration',
      exercises: 'exercises',
      userId: 'userId',
    },
    prepare(selection) {
      const { date, duration, exercises, userId } = selection
      const exerciseCount = exercises ? exercises.length : 0
      const formattedDate = date ? new Date(date).toLocaleDateString() : 'No date'
      const formattedDuration = duration ? `${Math.floor(duration / 60)}m ${duration % 60}s` : '0m'
      
      return {
        title: `Workout - ${formattedDate}`,
        subtitle: `${exerciseCount} exercise${exerciseCount !== 1 ? 's' : ''} • ${formattedDuration} • User: ${userId?.slice(0, 8)}...`,
      }
    },
  },
})